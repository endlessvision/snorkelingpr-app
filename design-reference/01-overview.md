# 01 · Overview

## What the app is

**Snorkeling Puerto Rico** is a mobile app for a snorkeling tour operator in Puerto Rico (Fajardo · Icacos · Vieques · Palomino). It blends three things:

1. **Tour booking** — discover, pick a date, meet the crew, pay.
2. **A playful game/collection layer** — the ocean is explorable; you pop coin bubbles, play mini-games, collect marine life, and earn gear.
3. **A coin economy** — coins earned in the ocean and mini-games are spent in a Coin Shop on real perks (discounts, upgrades, rentals) or gambled in mini-games.

The signature feel: **the home/dive screen *is* the sea** — a big underwater world you pan through, getting darker and rarer the deeper you go.

## The exact stack (decided — do not substitute)

| Layer | Choice | Why |
|-------|--------|-----|
| Mobile | **React Native + Expo + TypeScript** | Open on a real phone in minutes (Expo Go + QR), live reload while editing |
| Navigation | **expo-router** | File-based, typed routes |
| Animation | **react-native-reanimated** + **react-native-gesture-handler** | The Dive pan/drag + many looping animations need to run on the UI thread at 60fps |
| Client state | **Zustand** | Simple store for coins/gear/game state |
| Server data | **React Query (TanStack Query)** | Caching, loading/error states |
| Backend | **Node.js + NestJS** | Modular, typed, Swagger docs *(deferred — not in the first build)* |
| DB / Auth / Storage | **Supabase (PostgreSQL)** | Managed Postgres + auth + file storage *(deferred)* |
| Payments | **Stripe** | Native Payment Sheet, Apple/Google Pay *(deferred — bookings come later)* |
| Push | **Firebase Cloud Messaging** | Free, cross-platform *(deferred)* |
| Monorepo | **pnpm workspaces** | Share types between app and API |

## Golden rules

1. **Pixel-faithful to the prototypes.** The three `.dc.html` files are the source of truth for look and motion. Use the token values in `05-design-tokens.md` — don't eyeball new colors.
2. **Always runnable on a phone.** Never leave the mobile app in a state that won't boot in Expo Go.
3. **Small increments, each verifiable.** After each feature, there's a clear "here's how to see it."
4. **Contributor-ready.** Clean folders, typed shared models, README + CONTRIBUTING, `.env.example`, zero secrets committed.
5. **No invented scope.** Build the spec. Ask when unsure. Mark suggestions as suggestions.

## Current build scope (important)

**Bookings and payments are deferred** — do not build them in this pass. That means: no Stripe, no tour checkout/date-picker, no booking backend, and (for now) no Supabase server or auth. The Book/Shop tab is a simple "Coming soon" placeholder.

This first build is the **game experience, fully local**: opening animation, the Dive ocean, all mini-games, the coin economy, gear, redeem/coin-shop, collection, and passport — with progress saved on the device. The backend, accounts, tours, and payments get added in a later phase, on clean seams left in the code. See the phased order in `PROMPT.md`.

## Fidelity notes

- The marine creatures in the prototypes are drawn with inline SVG. In the app, **reuse those SVG shapes** (via `react-native-svg`) so it looks identical — you do not need real photos to match the design. Real species photography can come later.
- The prototypes are shown inside a drawn "phone" frame at 380×820. In the real app that frame *is* the device — build the screens full-bleed to the safe area.
