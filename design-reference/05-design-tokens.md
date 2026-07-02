# 05 · Design tokens

Copy these exact values into `apps/mobile/src/theme/tokens.ts`. Pulled from the prototypes.

## Fonts (load via `expo-font` / `@expo-google-fonts`)
- **Fredoka** (400–700) — display/playful headings, greetings, big numbers.
- **Nunito** (400–900) — labels, chips, badges, UI text, coin numbers (use 700–800).
- **Plus Jakarta Sans** (400–800) — body copy, descriptions.
- **Space Grotesk** (400–700) — used by Direction B (premium) headings; optional for A.

## Brand palette
```ts
export const color = {
  surfTurquoise: '#16C0D8', // primary accent, water
  deepSea:       '#0A4F70', // display text on light, deep backgrounds
  reefMagenta:   '#FF2E93', // primary CTA, "spark of joy"
  sunshine:      '#FFD23F', // badges, coins, highlights
  seaFoam:       '#7FE6EF', // light surfaces, glints
  sandCream:     '#FFF6E6', // warm neutral bg
  coinGold:      '#F4C93D', // coin fill
  coinRim:       '#C9962A', // coin outline
};
```

## Direction A — "Sunlight" (default, bright)
```ts
export const themeA = {
  bg:        '#F3FBFC',
  surface:   '#FFFFFF',
  primary:   '#16C0D8',
  ctaFrom:   '#FF5BB0', ctaTo: '#FF2E93',  // magenta gradient
  text:      '#0A4F70',
  textMuted: '#6B8694',
};
```

## Direction B — "Deep Blue" (premium, optional)
```ts
export const themeB = {
  bg:        '#03182A',
  surface:   'rgba(255,255,255,0.04)',
  border:    'rgba(150,240,240,0.18)',
  primary:   '#38E1D6',
  accent:    '#FF3D8B',
  ctaFrom:   '#5CF0E6', ctaTo: '#1BB6C9',
  text:      '#EEF6F7',
  textMuted: 'rgba(180,220,225,0.6)',
};
```

## Dive ocean gradient (top → bottom, the pannable world)
```
#c2f0f5 0% · #67dbe8 8% · #22c2d8 20% · #0ea3c6 33% · #0a83ac 46% ·
#0a6389 60% · #084a6c 72% · #063a54 82% · #04283c 91% · #02141f 100%
```
Home screen (phone) gradient: `#bdf1f6 → #5fd9e6 → #16c0d8 → #0a8fb6 → #0a5c84 → #073a5c`.

## Depth zones (by depth in ft)
`Surface` <20 · `Reef Garden` 20–69 · `Reef Wall` 70–129 · `Deep Blue` 130–194 · `The Abyss` 195+.

## Gear colors
Masks: Explorer `#16c0d8`, Fortune `#f4c93d`, Voyager `#ff2e93`.
Fins: Aqua `#19c6cf`, Coral `#ff5bb0`, Sunray `#ffd23f`.
Suits: Reef Blue `#2f7bff`, Kelp `#2fa86a`, Coral `#ff7a9c`.
Flags: Diver Down `#e2402f`, Alpha `#2f7bff`.

## Radii
```ts
export const radius = { sm: 8, md: 14, lg: 18, card: 22, phone: 46, pill: 100 };
```

## Spacing
8-pt grid. Screen padding ~22–24. Grid gaps 10–14. **Touch targets ≥ 44px** (kids + gloved hands).

## Type scale (px)
display 27–30 · big hero (passport cover) 62 · subtitle 19–21 · body 13.5–15 · label/caption 9–12. Display weight ~600; labels 700–800.

## Shadows
```
card:     0 14px 30px -14px rgba(3,40,60,.5)
ctaPink:  0 8px 18px -6px rgba(255,46,147,.5)
tabBar:   0 12px 30px -8px rgba(3,40,60,.45)
glowCyan (B): 0 0 22px rgba(56,225,214,.6)
```

## Motion — "everything feels like water"
Base easing (**tide**): `cubic-bezier(.22, 1, .36, 1)`. Named loops from the prototypes:
- `bobFloat` — translateY ±10px, ~5s.
- `swayFloat` — translateY + rotate ±3°, 7–9s (turtles, big creatures).
- `bubbleRise` — bubble rises ~120px + fades, 5–6s.
- `shimmer` — caustic light rays, opacity .35↔.7, 6–7s.
- `dvSwim` / `dvGlide` — fish drift across, 9–14s.
- Coin collect: quick pop + rise (`dvPop`, .7s).
- Depth Gamble FX: `dgShake`/`dgShakeHard` (tension), `dgLunge` (shark on bust), `dgWarn`/`dgGlowRisk` (high-risk descend button), `dgStamp`/`dgPulse` (cash-out), `dgCoinFly`/`dgCoinFall` (coin rewards).

In React Native, implement these with **reanimated** shared values / `withRepeat` + `withTiming` using the tide easing. Keep loops on the UI thread for 60fps.

## Emoji → replace later
The prototype uses a few emoji as functional icons (🛂 Passport, 🛍️ Shop, 🔊 audio, 📍). Fine to ship with, but plan to swap for a consistent icon set. The marine creatures are **SVG, not emoji** — port them faithfully.
