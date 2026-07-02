# Contributing to Snorkeling Puerto Rico

Thanks for helping build this! This is a game-first mobile app (React Native +
Expo) for a real snorkeling tour operator in Puerto Rico. Here's how to get
running and contribute.

## Setup

1. Install **Node 20+** and **pnpm** (`npm i -g pnpm`).
2. Install the **Expo Go** app on your phone (App Store / Google Play).
3. From the repo root:
   ```bash
   pnpm install
   pnpm --filter mobile start
   ```
4. Scan the QR code with your phone (Camera app on iOS, Expo Go on Android).
   Fast Refresh reloads the app as you edit.

See [`design-reference/03-preview-on-phone.md`](design-reference/03-preview-on-phone.md)
for more detail, including running behind a firewall (`--tunnel`).

## Current build scope

**Bookings and payments are deferred.** Do not add Stripe, tour checkout, or a
backend/auth in this phase — the app is fully local (AsyncStorage-backed). See
[`design-reference/01-overview.md`](design-reference/01-overview.md) for the
full scope and [`design-reference/06-backend.md`](design-reference/06-backend.md)
for the future backend plan.

## Design fidelity

The three `.dc.html` files in `design-reference/` are the visual and
behavioral source of truth. Match colors, spacing, and motion against
[`design-reference/05-design-tokens.md`](design-reference/05-design-tokens.md)
— don't eyeball new values. Marine-life art is ported as `react-native-svg`
shapes copied from the prototypes, not new illustrations.

## Branch naming

- New features: `feature/short-description`
- Bug fixes: `fix/short-description`
- Docs: `docs/short-description`

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add lucky reels slot machine`
- `fix: correct depth gamble bust odds`
- `docs: update quickstart`

## Code style

- TypeScript, `strict: true`. Don't use `any` without a comment explaining why.
- Feature-first folders — everything for a feature lives together under
  `apps/mobile/src/features/<feature>/`.
- Shared types belong in `packages/shared`, imported by name — don't redefine
  a domain type (e.g. `Species`, `EconomyState`) in the app.
- ESLint + Prettier are configured at the root; run `pnpm lint` before opening
  a PR.

## Opening a PR

1. Branch off `main`.
2. Keep the app runnable at every commit — CI runs typecheck, lint, and a
   build on every push.
3. Describe what you changed and how you verified it (a screen recording or
   screenshot from Expo Go is great for UI changes).

## Where things live

See [`design-reference/02-repo-structure.md`](design-reference/02-repo-structure.md)
for the full folder map. Each mini-game (`Coin Rush`, `Lucky Reels`, `Depth
Gamble`) is a self-contained folder under
`apps/mobile/src/features/minigames/` with its own component, logic hook, and
styles.

## Good first issues

Look for issues labeled `good-first-issue` — typically a single screen's empty
state, a new species SVG, a new Coin Shop item, or localization work.
