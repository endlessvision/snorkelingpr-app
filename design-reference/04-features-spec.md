# 04 · Features spec (exact)

This is the behavioral source of truth. All values here are pulled from the working prototypes. Colors/fonts are in `05-design-tokens.md`.

---

## Opening splash → Home
From `Snorkeling Opening.dc.html`.

- On launch, a **full-screen splash** shows the logo image (`assets/snorkeling-logo.jpeg`) centered, ~82% width, rounded 24px corners.
- Splash background is a solid deep purple **`#870486`** (tweakable). Optional rising bubbles drift up behind the logo.
- Animation sequence (~2.8s total): **fade in + slight scale-down** (0→22%), **hold** (22→66%), **fade out** (66→100%). The logo also gently "breathes" (translateY ±6px).
- When it finishes, the **Home screen reveals** with a soft fade/scale-in (~0.6s).
- Provide a way to replay in dev, but in production it plays once per cold start.

**Home screen** (the revealed screen): gradient ocean background (light at top → deep at bottom), caustic light shimmer, rising bubbles, a few floating creatures. Content: greeting ("Good morning, Maya 🌊") + circular avatar (magenta disc, initial); a glass location pill ("📍 Floating above Icacos Reef · 12 ft"); a "↓ KEEP SCROLLING TO DIVE DEEPER" hint; a **"Your next dive"** card (label + time, tour title, crew avatar stack, "Captain Dante + 3 crew"). Bottom tab bar below.

## Bottom tab bar (all main screens)
Five items: **Dive** · **Collect** · **`+`** (center, raised magenta circle FAB) · **Passport** · **Shop**. Active item uses the turquoise accent; inactive is muted grey. The `+` opens "register a sighting" (can be a stub that opens the Dive coin/mini-game hub for now).

---

## THE DIVE SCREEN (centerpiece)
From `Snorkeling Dive.dc.html`. This is a large **pannable 2D underwater world**, not a scrolling list.

### The world
- World size: **1120 × 4200** px. The viewport shows a phone-sized window (~366×806) onto it.
- The user **drags** (pan) freely up/down and left/right. Clamp so you can't pan past the world edges. Support mouse wheel on web and touch drag on device. Momentum/inertia is a plus.
- Vertical gradient from bright aqua at top to near-black at the bottom (surface → abyss). Exact gradient stops in tokens.
- **Depth zones** by vertical position, top→bottom: **Surface** (<20ft) → **Reef Garden** (20–70) → **Reef Wall** (70–130) → **Deep Blue** (130–195) → **The Abyss** (195+) → **Seafloor** (with a treasure chest and sandy floor at the bottom).
- Populate each zone with **colorful fish and corals** (ported SVGs) that gently animate: `dvSwim` (drift across), `dvBob` (up/down), `dvSway` (rotate+float), plus ambient rising bubbles, caustic light rays at the top, and **bioluminescent dots** in the abyss. A **sea turtle**, branching/fan/pillar/brain corals, a treasure chest that glows, a starfish, and an anchor sit at the seafloor. Match placements and colors from the prototype.

### HUD (fixed over the world)
- **Depth gauge**: a vertical bar on the right showing current depth in ft + zone name, updating live as you pan down. Max ~165ft label range.
- **Coins**: a pill top-left/top-right showing the live coin balance with the coin icon.
- Buttons to launch **⚡ Coin Rush**, **🤿 Gear**, and a **🎁 Redeem** entry (see below). Exact placement per prototype (stacked, top-left, glassy pills).

### Collectible coin bubbles
- ~11 coin bubbles are placed across the world at set positions with values **5 → 50** (deeper = worth more). Data: id, left, top, value.
- Each renders as a glassy bubble with a gold coin inside and a "+N" label, gently bobbing.
- **Tap a bubble** → it disappears, a "+N 🪙" burst pops at that spot, and the value is added to the coin balance. A tapped bubble stays collected (don't respawn in the same session).
- Tapping a bubble must **not** trigger a pan drag (stop propagation on pointer-down).

---

## MINI-GAMES

### 1) Coin Rush (⚡) — timed tap game
- Full-screen overlay. A **30-second** round (35s with Sunray Fins perk).
- Coins, gems, and **urchins** spawn and rise/float across; tap coins/gems to score, avoid urchins.
- **Combo system**: consecutive good taps build a combo; multiplier grows ×1→×5 (every 3 combo steps). Missing/urchin resets combo.
- Urchin tap: **−5** and combo reset + screen flash (unless the **Reef Blue Suit** perk is equipped — then urchins are harmless, show a ✓).
- Coin value = base × multiplier, with perks applied (see Gear). Gems worth more; rare-gem chance rises with the **Explorer Mask** / **Alpha Flag**.
- Live HUD: score, time left, current combo. On end: show final coins earned (+5 bonus with **Diver Down Flag**) and best multiplier, then add to balance. Reads/writes the shared coin balance.

### 2) Lucky Reels (🎰) — slot machine (in the Redeem area)
- Spend **15 coins** per spin (button greys out / shows "Spinning…" while animating; free if a future free-spin exists).
- Three reels animate and stop staggered (~0.8s, 1.2s, 1.65s). Symbols: `coin`, `fish`, and the three masks (`explorer`, `fortune`, `voyager`).
- Outcomes: **three matching masks** → win that mask (only among masks you don't own yet, ~30% weighted); **three coins** = jackpot **+40**; a coin pair = **+8**; otherwise "so close, spin again."
- **Masks won here are OWNED**; they become ACTIVE only when equipped in the Gear locker.
- Shows the three mask cards below with OWNED / LOCKED status and their perks.

### 3) Depth Gamble (🎲) — double-or-nothing descent (casino-style)
- **Bet stage:** pick a stake — **10 / 25 / 50** coins. "Start the descent" (greyed if you can't afford).
- **Diving stage:** a vertical depth tube with a diver marker. Your **pot** starts at the stake. Each **Descend** goes one level deeper, multiplying the pot but with rising **bust risk**. Levels (ft / multiplier / bust risk):
  - 12 / ×1.0 / 0% · 35 / ×1.3 / 8% · 60 / ×1.7 / 15% · 90 / ×2.3 / 22% · 120 / ×3.1 / 30% · 155 / ×4.3 / 38% · 195 / ×6.2 / 47% · 240 / ×9.5 / 57%
  - Show current depth + zone, current pot + multiplier, and the **next** level's multiplier and **risk %** in red.
  - Descending resolves after ~0.95s of suspense (tube/diver animates down). On bust → a shark "swept away" screen, you lose the stake. Otherwise pot updates.
- **Cash out** any time → "Surfaced safely, +N coins" screen, pot added to balance.
- Make it **thrilling**: escalating shake as risk rises, warning glow on the descend button at high risk, coin-fly/coin-fall FX, shark lunge on bust, a stamp/pulse on cash-out. (These animations exist in the prototype's keyframes — reproduce the feel.)

---

## COIN ECONOMY (shared state)
- A single **coin balance** is shared across the whole Dive experience: bubbles add, mini-games add/spend, the shop and gambles spend.
- Persist locally (so it survives app restarts) and later sync to the backend (`06-backend.md`). Use optimistic updates so it always feels instant.

---

## GEAR LOCKER (🤿)
A full overlay. All gear is **optional**; equipping grants a real gameplay perk. A **diver avatar** is drawn (react-native-svg) and visibly updates as you equip items (mask color on face, wetsuit color on body, colored fins, a dive flag on a pole) and does a gentle idle bob with rising snorkel bubbles.

Category tabs: **Mask · Fins · Wetsuit · Flag**. Tap an option to equip/unequip (one per category). Options + perks:

- **Mask** (won via Lucky Reels; locked until owned): Explorer `#16c0d8` — rare fish appear more often · Fortune `#f4c93d` — +50% coins per bubble · Voyager `#ff2e93` — 15% off the Coin Shop.
- **Fins**: Aqua `#19c6cf` — coin bubbles worth +1 · Coral `#ff5bb0` — +10% coins in Coin Rush · Sunray `#ffd23f` — Coin Rush lasts 5s longer.
- **Wetsuit**: Reef Blue `#2f7bff` — urchins no longer hurt you · Kelp Green `#2fa86a` — cosmetic · Coral `#ff7a9c` — cosmetic.
- **Flag**: Diver Down `#e2402f` — +5 coins each Coin Rush · Alpha `#2f7bff` — attracts rare fish.

Equipped item shows "✓ EQUIPPED"; locked masks show "🔒 LOCKED" with a hint to win them in Lucky Reels. **Perks must actually affect the mini-games** (wire them into Coin Rush spawn rates, coin math, round length, urchin handling, and shop pricing).

---

## REDEEM (🎁) + COIN SHOP (🛍️)
- The **Redeem** button opens a sheet: intro line, then entry buttons to **Lucky Reels**, **Depth Gamble**, and the **Coin Shop**.
- The **Coin Shop** is its own overlay listing real-world perks you buy with coins. Items (name · desc · cost · icon):
  - Reef Guardian pin · Enamel collector pin · **20** · 📛
  - Welcome cocktail · On the house at the dock · **35** · 🍹
  - GoPro rental · 1-day underwater camera · **60** · 📸
  - 15% off next tour · Any Fajardo departure · **90** · 🎟️
  - Sunset snorkel upgrade · Private golden-hour dive · **150** · 🌅
- Buying: if affordable and not already redeemed, subtract coins and mark "✓ Redeemed"; else nudge "Not enough coins — keep diving!". The **Voyager Mask** perk applies a **15% discount** to every price.

---

## OTHER SCREENS (from `Snorkeling PR App.dc.html`)
Two visual directions exist in the prototype (A "Sunlight" bright, B "Deep Blue" premium). **Default to Direction A** unless I say otherwise; keep tokens swappable.

- **Collection** — grid of collectible species (unlocked vs locked silhouettes), a progress bar ("27 / 84"), category chips, a "rare discoveries" banner.
- **Ocean Passport** — explorer profile: avatar + name + level badge ("Reef Guardian · Lvl 4"), 4 stats (tours, species, miles, years), destination stamps (some locked), "crew you've met" avatars.
- **Species Card** — detail: hero with the creature + rarity badge, common/scientific name, an audio button, 3 stat chips (depth, spot difficulty, conservation status), a fun-fact card, "where to see it in PR" chips, and a "first spotted by you" card.
- **Book** — *deferred.* For this build, show a simple placeholder ("Tours & booking coming soon") on the Shop/Book tab. The tour catalog, date picker, crew/countdown, and the "Reserve my spot" checkout (Stripe) will be added in a later phase — build none of that payment/booking code now.

### States to build for every screen (the prototype only shows the happy path)
Loading (skeletons), empty (new user — 0 coins, 0 collection), error + retry, offline. Register-a-sighting flow (the `+` tab) unlocks a species with a bubbly celebration.

> **Note on Book / bookings / payments:** deferred for now. The Book/Shop tab can be a simple "Coming soon" placeholder. Do not build the tour checkout, date picker, Stripe, or any payment/booking code in this pass — it will be added in a later phase.
