# 02 · Repo structure

A pnpm monorepo so the app and API share TypeScript types.

```
snorkeling-pr/
├─ README.md                  # what it is, quickstart, screenshots
├─ CONTRIBUTING.md            # how to contribute (see 07-github-setup.md)
├─ .gitignore
├─ .env.example               # every env var, no real values
├─ package.json               # workspace root
├─ pnpm-workspace.yaml
├─ design-reference/          # the handoff docs + the 3 .dc.html prototypes
│
├─ apps/
│  ├─ mobile/                 # React Native + Expo app
│  │  ├─ app/                 # expo-router routes
│  │  │  ├─ _layout.tsx       # root: fonts, splash gate, providers
│  │  │  ├─ index.tsx         # opening splash -> redirect to (tabs)
│  │  │  └─ (tabs)/
│  │  │     ├─ _layout.tsx    # bottom tab bar (Dive · Collect · + · Passport · Shop)
│  │  │     ├─ dive.tsx       # the ocean world (centerpiece)
│  │  │     ├─ collect.tsx    # Collection grid
│  │  │     ├─ passport.tsx   # Ocean Passport
│  │  │     └─ shop.tsx       # Book / Shop
│  │  ├─ src/
│  │  │  ├─ theme/            # tokens.ts, fonts.ts (from 05-design-tokens.md)
│  │  │  ├─ components/       # Button, Card, CoinPill, PhoneSafeArea, Bubble…
│  │  │  ├─ features/
│  │  │  │  ├─ dive/          # OceanWorld, DepthGauge, CoinBubble, creatures/
│  │  │  │  ├─ minigames/     # CoinRush/, LuckyReels/, DepthGamble/
│  │  │  │  ├─ gear/          # GearLocker, DiverAvatar, gearDefs.ts
│  │  │  │  ├─ redeem/        # RedeemSheet, CoinShop, prizeDefs.ts
│  │  │  │  ├─ collection/
│  │  │  │  ├─ passport/
│  │  │  │  └─ booking/
│  │  │  ├─ store/            # zustand: useEconomy (coins, gear, masks, collection)
│  │  │  ├─ api/              # React Query hooks + fetch client
│  │  │  ├─ svg/              # marine-life SVGs ported from the prototype (react-native-svg)
│  │  │  └─ lib/              # helpers (depth math, formatters)
│  │  ├─ assets/              # snorkeling-logo.jpeg, fonts, icons
│  │  ├─ app.json             # expo config
│  │  └─ package.json
│  │
│  └─ api/                    # NestJS backend
│     ├─ src/
│     │  ├─ main.ts           # bootstrap + Swagger at /docs
│     │  ├─ modules/
│     │  │  ├─ auth/  users/  tours/  bookings/  payments/
│     │  │  ├─ species/  sightings/  collection/
│     │  │  ├─ economy/       # coins, gear, mini-game results
│     │  │  └─ passport/
│     │  └─ common/           # guards, dtos, filters, supabase client
│     ├─ test/
│     └─ package.json
│
├─ packages/
│  └─ shared/                 # types shared by app + api (Coin, GearItem, Tour, Species…)
│     └─ src/index.ts
│
└─ supabase/
   ├─ migrations/             # SQL schema (see 06-backend.md)
   └─ seed.sql                # tours, species, dive sites, crew
```

## Conventions
- **TypeScript everywhere**, `strict: true`.
- Shared domain types live in `packages/shared` and are imported by both app and API — never redefine a `Tour` in two places.
- Feature-first folders in the app (everything for a feature in one place).
- ESLint + Prettier at the root, shared config.
- Each mini-game is a self-contained folder with its own component, logic hook, and styles.
