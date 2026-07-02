# Snorkeling Puerto Rico 🌊

A mobile app for a snorkeling tour operator in Puerto Rico (Fajardo · Icacos ·
Vieques · Palomino) — where the home screen *is* the sea. Pan through a big
underwater world, pop coin bubbles, play mini-games, collect marine life, and
spend coins on gear and real-world perks.

This first build is the **game experience, fully local**: opening animation,
the Dive ocean, all mini-games, the coin economy, gear, redeem/coin-shop,
collection, and passport — progress saved on-device. Bookings, payments, and
the backend are a later phase (see [`design-reference/01-overview.md`](design-reference/01-overview.md)).

## Stack

React Native + Expo + TypeScript · expo-router · Zustand · React Native
Reanimated + Gesture Handler · react-native-svg · pnpm workspaces.

## Quickstart

```bash
npm i -g pnpm                 # once
pnpm install                  # from the repo root
pnpm --filter mobile start    # starts Expo — scan the QR with Expo Go
```

Full instructions (including running behind a firewalled Wi-Fi) are in
[`design-reference/03-preview-on-phone.md`](design-reference/03-preview-on-phone.md).

## Repo structure

See [`design-reference/02-repo-structure.md`](design-reference/02-repo-structure.md)
for the full map. Short version:

```
apps/mobile/       React Native + Expo app (expo-router)
packages/shared/    Types shared across the app (and, later, the API)
design-reference/   The handoff docs + HTML prototypes — the visual/behavioral source of truth
```

## Design source of truth

The `.dc.html` files under `design-reference/` are pixel- and motion-accurate
prototypes. Colors, type, spacing, and animation timings all come from
[`design-reference/05-design-tokens.md`](design-reference/05-design-tokens.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues labeled `good-first-issue` are
a good place to start.

## License

MIT — see [`LICENSE`](LICENSE).
