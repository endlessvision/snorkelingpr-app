# 06 · Backend (DEFERRED — later phase)

> **Not part of the current build.** The first version of the app runs **fully on-device** (economy, gear, collection saved with AsyncStorage/MMKV) with **no server, no auth, and no payments**. This document is the plan for when you're ready to add a backend, accounts, tours, and bookings later. Build the app now with clean seams (typed models in `packages/shared`, economy access behind a small storage service) so this drops in additively.

NestJS + Supabase (PostgreSQL). REST, JWT from Supabase Auth, Swagger at `/docs`. This is the MVP surface that supports the app above; a fuller product/data model lives in `../design_handoff_snorkeling_pr/` (04-data-model, 05-api) if you want more depth.

## What must persist (drives the app)
- **User + profile** (Supabase Auth `auth.users` ↔ `users`).
- **Economy:** coin balance, owned masks, equipped gear (mask/fins/suit/flag), redeemed shop items.
- **Collection:** which species a user has unlocked + progress.
- **Bookings + payments** for tours.
- **Catalog (seeded, mostly read):** tours, tour_instances, dive_sites, crew, species.

## Core tables (SQL sketch)
```
users(id uuid pk = auth.uid, display_name, avatar_url, level int, xp int, created_at)
economy(user_id uuid pk fk users, coins int default 0,
        gear jsonb default '{"mask":null,"fins":null,"suit":null,"flag":null}',
        masks jsonb default '{"explorer":false,"fortune":false,"voyager":false}',
        updated_at)
redemptions(id uuid pk, user_id fk, item_key text, cost int, redeemed_at)  -- unique(user_id,item_key)
dive_sites(id uuid pk, name, slug, region, lat, lng)
tours(id uuid pk, title, slug, dive_site_id fk, duration_minutes, base_price_cents, includes text[], badges text[], hero_image_url, is_active)
tour_instances(id uuid pk, tour_id fk, starts_at, ends_at, capacity, seats_remaining, price_cents, status)
crew(id uuid pk, name, role, avatar_url, bio)
species(id uuid pk, common_name, scientific_name, category, rarity, conservation_status, depth_min_ft, depth_max_ft, fun_fact, image_url, sound_url)
user_species(user_id fk, species_id fk, unlocked_at, primary key(user_id,species_id))
bookings(id uuid pk, user_id fk, tour_instance_id fk, party_size, status, total_cents, confirmation_code)
payments(id uuid pk, booking_id fk, provider, provider_intent_id unique, amount_cents, status)
```
Money in integer cents. Enable **Row Level Security** on all per-user tables (a user reads/writes only their own economy, redemptions, bookings, user_species).

## Endpoints (REST, `/v1`, Bearer JWT)
```
GET   /me                       -> profile + economy snapshot
PATCH /me                       -> display_name, avatar_url
GET   /economy                  -> { coins, gear, masks, redemptions }
POST  /economy/coins            -> { delta, reason } add/spend (server validates >=0)
POST  /economy/gear             -> { category, itemId|null } equip/unequip
POST  /economy/masks/unlock     -> { maskId } (from Lucky Reels win)
POST  /economy/redeem           -> { itemKey } spend coins for a shop perk (applies Voyager discount)
GET   /collection               -> unlocked species + progress
POST  /sightings                -> { speciesId, siteId? } unlock a species
GET   /tours                    -> catalog
GET   /tours/:id/instances      -> dates with seats
POST  /bookings                 -> create pending (validates seats atomically)
POST  /bookings/:id/payment-intent -> Stripe client_secret
POST  /webhooks/stripe          -> confirm payment (verify signature, idempotent)
GET   /passport                 -> stats, level, stamps, crew met
```
Standard error shape `{ error: { code, message } }`; cursor pagination `?limit&cursor`; rate-limit auth & payments; validate all input with DTOs (`class-validator`).

## Important server rules
- **Coins are authoritative on the server** once auth exists — the client sends deltas with a reason; the server rejects anything that would go negative and is the final say on balance (prevents cheating at scale).
- **Seat booking** decrements `seats_remaining` in one transaction to avoid overbooking.
- **Stripe webhook** is the source of truth for `confirmed` bookings; make it idempotent via `provider_intent_id`.

## Offline / sync
The game must feel instant, so the client keeps a local economy store and **syncs deltas** to `/economy/*` (optimistic, queue while offline, reconcile on reconnect). Sightings/coins are append-style and idempotent by a client-generated id.
