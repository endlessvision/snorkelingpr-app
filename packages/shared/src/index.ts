// Domain types shared by the mobile app (and, later, the API).
// This build is fully local — no server/auth/payment types yet.
// See design-reference/06-backend.md for the shape those will take.

export type GearCategory = "mask" | "fins" | "suit" | "flag";

export type MaskId = "explorer" | "fortune" | "voyager";
export type FinsId = "aqua" | "coral" | "sunray";
export type SuitId = "reef" | "kelp" | "coralpink";
export type FlagId = "diver" | "alpha";

export type GearId = MaskId | FinsId | SuitId | FlagId;

export interface GearOptionDef<Id extends GearId = GearId> {
  id: Id;
  name: string;
  color: string;
  perk: string;
}

export interface EquippedGear {
  mask: MaskId | null;
  fins: FinsId | null;
  suit: SuitId | null;
  flag: FlagId | null;
}

export type OwnedMasks = Record<MaskId, boolean>;

export interface CoinBubbleDef {
  id: string;
  left: number;
  top: number;
  value: number;
}

export interface ShopItemDef {
  key: string;
  name: string;
  desc: string;
  cost: number;
  icon: string;
}

export interface DepthGambleLevel {
  ft: number;
  mult: number;
  risk: number;
}

export type DepthZoneName =
  | "Surface"
  | "Reef Garden"
  | "Reef Wall"
  | "Deep Blue"
  | "The Abyss";

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: "reef" | "turtle" | "shark" | "ray" | "other";
  rarity: "common" | "uncommon" | "rare";
  conservationStatus: string;
  depthMinFt: number;
  depthMaxFt: number;
  spotDifficulty: 1 | 2 | 3;
  funFact: string;
  foundAt: string[];
}

/** XP earned in the current ISO week — drives the weekly leaderboard (Phase 9). */
export interface WeekXp {
  /** ISO-ish week key, e.g. "2026-w27". */
  week: string;
  xp: number;
}

/** Daily-claim streak state (Phase 4). `last` is a "YYYY-MM-DD" date string. */
export interface Streak {
  count: number;
  last: string;
}

/** Monthly raffle entries (Phase 8). Resets when the month key changes. */
export interface Raffle {
  /** Month key, e.g. "2026-7". */
  month: string;
  entries: number;
}

/** The whole persisted local economy — see packages/shared as the single source of truth for its shape. */
export interface EconomyState {
  coins: number;
  /** Lifetime XP — drives the Diver tier (Phase 3). */
  xp: number;
  /** XP earned this ISO week — drives the leaderboard (Phase 9). */
  weekXp: WeekXp;
  gear: EquippedGear;
  masks: OwnedMasks;
  redeemedShopItems: string[];
  collectedCoinBubbles: string[];
  /** Ocean gem (XP) bubbles popped (Phase 2). */
  poppedGems: string[];
  /** Species added to the collection (the handoff's "logged" set). */
  unlockedSpeciesIds: string[];
  /** Consecutive daily-claim streak (Phase 4). */
  streak: Streak;
  /** Unused free Lucky Reels spins (Phase 4 → Phase 6). */
  freeSpins: number;
  /** Raffle tickets for the current month (Phase 8). */
  raffle: Raffle;
  /** Sound muted toggle (Phase 5). */
  muted: boolean;
}

export const DEFAULT_ECONOMY: EconomyState = {
  coins: 0,
  xp: 0,
  weekXp: { week: "", xp: 0 },
  gear: { mask: null, fins: null, suit: null, flag: null },
  masks: { explorer: false, fortune: false, voyager: false },
  redeemedShopItems: [],
  collectedCoinBubbles: [],
  poppedGems: [],
  unlockedSpeciesIds: [],
  streak: { count: 0, last: "" },
  freeSpins: 0,
  raffle: { month: "", entries: 0 },
  muted: false,
};

// ===== Static catalogs (ported from Snorkeling Dive.dc.html) =====

export const GEAR_DEFS: {
  mask: GearOptionDef<MaskId>[];
  fins: GearOptionDef<FinsId>[];
  suit: GearOptionDef<SuitId>[];
  flag: GearOptionDef<FlagId>[];
} = {
  mask: [
    { id: "explorer", name: "Explorer Mask", color: "#16c0d8", perk: "Rare fish appear more often" },
    { id: "fortune", name: "Fortune Mask", color: "#f4c93d", perk: "+50% coins per bubble" },
    { id: "voyager", name: "Voyager Mask", color: "#ff2e93", perk: "15% off the Coin Shop" },
  ],
  fins: [
    { id: "aqua", name: "Aqua Fins", color: "#19c6cf", perk: "Coin bubbles worth +1" },
    { id: "coral", name: "Coral Fins", color: "#ff5bb0", perk: "+10% coins in Coin Rush" },
    { id: "sunray", name: "Sunray Fins", color: "#ffd23f", perk: "Coin Rush lasts 5s longer" },
  ],
  suit: [
    { id: "reef", name: "Reef Blue Suit", color: "#2f7bff", perk: "Urchins no longer hurt you" },
    { id: "kelp", name: "Kelp Green Suit", color: "#2fa86a", perk: "Cosmetic" },
    { id: "coralpink", name: "Coral Suit", color: "#ff7a9c", perk: "Cosmetic" },
  ],
  flag: [
    { id: "diver", name: "Diver Down Flag", color: "#e2402f", perk: "+5 coins each Coin Rush" },
    { id: "alpha", name: "Alpha Flag", color: "#2f7bff", perk: "Attracts rare fish" },
  ],
};

export const COIN_BUBBLE_DEFS: CoinBubbleDef[] = [
  { id: "c1", left: 170, top: 300, value: 5 },
  { id: "c2", left: 620, top: 520, value: 5 },
  { id: "c3", left: 300, top: 900, value: 10 },
  { id: "c4", left: 860, top: 1150, value: 10 },
  { id: "c5", left: 520, top: 1520, value: 10 },
  { id: "c6", left: 150, top: 1980, value: 15 },
  { id: "c7", left: 760, top: 2260, value: 15 },
  { id: "c8", left: 420, top: 2700, value: 20 },
  { id: "c9", left: 900, top: 3080, value: 25 },
  { id: "c10", left: 250, top: 3480, value: 25 },
  { id: "c11", left: 560, top: 3820, value: 50 },
];

/** Gem (XP) bubbles — award XP, not coins. Interleaved with coins down the depth. */
export const GEM_BUBBLE_DEFS: CoinBubbleDef[] = [
  { id: "g1", left: 430, top: 460, value: 10 },
  { id: "g2", left: 760, top: 780, value: 10 },
  { id: "g3", left: 210, top: 1240, value: 15 },
  { id: "g4", left: 640, top: 1700, value: 15 },
  { id: "g5", left: 350, top: 2180, value: 20 },
  { id: "g6", left: 880, top: 2520, value: 20 },
  { id: "g7", left: 180, top: 2980, value: 25 },
  { id: "g8", left: 690, top: 3360, value: 30 },
  { id: "g9", left: 400, top: 3720, value: 40 },
];

export const SHOP_ITEM_DEFS: ShopItemDef[] = [
  { key: "reef-guardian-pin", name: "Reef Guardian pin", desc: "Enamel collector pin", cost: 20, icon: "📛" },
  { key: "welcome-cocktail", name: "Welcome cocktail", desc: "On the house at the dock", cost: 35, icon: "🍹" },
  { key: "gopro-rental", name: "GoPro rental", desc: "1-day underwater camera", cost: 60, icon: "📸" },
  { key: "tour-discount", name: "15% off next tour", desc: "Any Fajardo departure", cost: 90, icon: "🎟️" },
  { key: "sunset-upgrade", name: "Sunset snorkel upgrade", desc: "Private golden-hour dive", cost: 150, icon: "🌅" },
];

export const DEPTH_GAMBLE_LEVELS: DepthGambleLevel[] = [
  { ft: 12, mult: 1.0, risk: 0 },
  { ft: 35, mult: 1.3, risk: 0.08 },
  { ft: 60, mult: 1.7, risk: 0.15 },
  { ft: 90, mult: 2.3, risk: 0.22 },
  { ft: 120, mult: 3.1, risk: 0.3 },
  { ft: 155, mult: 4.3, risk: 0.38 },
  { ft: 195, mult: 6.2, risk: 0.47 },
  { ft: 240, mult: 9.5, risk: 0.57 },
];

export function depthZoneForFt(ft: number): DepthZoneName {
  if (ft < 20) return "Surface";
  if (ft < 70) return "Reef Garden";
  if (ft < 130) return "Reef Wall";
  if (ft < 195) return "Deep Blue";
  return "The Abyss";
}

// ===== Diver status tiers (Phase 3) =====

export interface DiverTier {
  icon: string;
  name: string;
  /** Lifetime XP needed to reach this tier. */
  xp: number;
  tag: string;
  perk: string;
  color: string;
  glow: string;
}

/** Ported from tierDefs() in Snorkeling Dive.dc.html. */
export const DIVER_TIERS: DiverTier[] = [
  { icon: "🤿", name: "Snorkeler", xp: 0, tag: "Everyone starts at the surface", perk: "Welcome aboard — start logging sea life to rank up", color: "#7fe6ef", glow: "rgba(127,230,239,.35)" },
  { icon: "🐠", name: "Reef Guardian", xp: 120, tag: "The reef knows your name", perk: "+1 free raffle ticket every month · exclusive fin color", color: "#16c0d8", glow: "rgba(22,192,216,.4)" },
  { icon: "🌊", name: "Deep Explorer", xp: 350, tag: "You belong to the deep", perk: "+2 free raffle tickets monthly · exclusive gear set · early access to events", color: "#ffd23f", glow: "rgba(255,210,63,.4)" },
  { icon: "⚓", name: "Honorary Captain", xp: 800, tag: "The crew salutes you", perk: "Priority boarding on real tours · captain's flag · your name on the boat leaderboard", color: "#ff2e93", glow: "rgba(255,46,147,.4)" },
];

/** Index of the highest tier whose XP threshold is met. */
export function tierIndexFor(xp: number): number {
  let i = 0;
  for (let k = 0; k < DIVER_TIERS.length; k++) if (xp >= DIVER_TIERS[k].xp) i = k;
  return i;
}

/** Percent progress (4–100) toward the next tier; 100 at max rank. */
export function tierProgressPct(xp: number): number {
  const i = tierIndexFor(xp);
  if (i >= DIVER_TIERS.length - 1) return 100;
  const lo = DIVER_TIERS[i].xp;
  const hi = DIVER_TIERS[i + 1].xp;
  return Math.max(4, Math.min(100, Math.round(((xp - lo) / (hi - lo)) * 100)));
}

/** XP remaining to the next tier; 0 at max rank. */
export function xpToNextTier(xp: number): number {
  const i = tierIndexFor(xp);
  return i < DIVER_TIERS.length - 1 ? DIVER_TIERS[i + 1].xp - xp : 0;
}
