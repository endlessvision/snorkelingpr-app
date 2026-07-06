import { create } from "zustand";
import {
  DEFAULT_ECONOMY,
  EconomyState,
  GearCategory,
  GearId,
  MaskId,
  SHOP_ITEM_DEFS,
  Streak,
  tierIndexFor,
} from "@snorkeling/shared";
import { currentMonthKey, currentWeekKey } from "@/lib/periods";

export type RedeemResult = "ok" | "insufficient" | "already";

interface EconomyActions {
  /** True once the persisted state has been loaded (Phase 7). Starts true since
   *  there's no async load yet — the persistence layer flips it. */
  hydrated: boolean;

  earnCoins: (amount: number) => void;
  /** Returns false (and does nothing) if the balance can't cover it. */
  spendCoins: (amount: number) => boolean;

  /** Transient: the tier index just reached, if addXp crossed a threshold. UI
   *  shows a rank-up toast then calls clearRankUp(). */
  rankUp: number | null;
  clearRankUp: () => void;

  /** Add XP to lifetime `xp` AND the current week's `weekXp` (rolls over on a new
   *  ISO week). Sets `rankUp` when a tier threshold is crossed. */
  addXp: (amount: number) => void;

  /** Grant free Lucky Reels spins (Phase 4). */
  grantFreeSpin: (n?: number) => void;
  /** Consume one free spin; returns false if none available. */
  consumeFreeSpin: () => boolean;

  /** Equip an item, or unequip it if it's already the equipped one. */
  toggleGear: (category: GearCategory, id: GearId) => void;
  unlockMask: (id: MaskId) => void;

  collectCoinBubble: (id: string) => void;
  /** Mark an ocean gem (XP) bubble popped (Phase 2). The caller awards the XP via addXp. */
  popGem: (id: string) => void;
  unlockSpecies: (id: string) => void;

  redeemShopItem: (key: string) => RedeemResult;

  /** Set the daily streak (Phase 4). */
  setStreak: (streak: Streak) => void;
  /** Add raffle entries for the current month, rolling over on a new month (Phase 8). */
  addRaffleEntries: (n: number) => void;
  /** Toggle the muted flag (Phase 5). */
  toggleMuted: () => void;

  /** Replace the whole economy — used by the persistence layer on load (Phase 7). */
  hydrate: (state: Partial<EconomyState>) => void;
  reset: () => void;
}

export type EconomyStore = EconomyState & EconomyActions;

export const useEconomy = create<EconomyStore>((set, get) => ({
  ...DEFAULT_ECONOMY,
  // Flipped to true by hydrate() once the persisted state has loaded.
  hydrated: false,

  earnCoins: (amount) => set((s) => ({ coins: s.coins + Math.max(0, Math.round(amount)) })),

  spendCoins: (amount) => {
    const cost = Math.max(0, Math.round(amount));
    if (get().coins < cost) return false;
    set((s) => ({ coins: s.coins - cost }));
    return true;
  },

  rankUp: null,
  clearRankUp: () => set({ rankUp: null }),

  addXp: (amount) =>
    set((s) => {
      const n = Math.max(0, Math.round(amount));
      const nextXp = s.xp + n;
      const week = currentWeekKey();
      const weekXp =
        s.weekXp.week === week ? { week, xp: s.weekXp.xp + n } : { week, xp: n };
      const before = tierIndexFor(s.xp);
      const after = tierIndexFor(nextXp);
      return { xp: nextXp, weekXp, rankUp: after > before ? after : s.rankUp };
    }),

  grantFreeSpin: (n = 1) =>
    set((s) => ({ freeSpins: s.freeSpins + Math.max(0, Math.round(n)) })),

  consumeFreeSpin: () => {
    if (get().freeSpins <= 0) return false;
    set((s) => ({ freeSpins: s.freeSpins - 1 }));
    return true;
  },

  toggleGear: (category, id) =>
    set((s) => ({
      gear: { ...s.gear, [category]: s.gear[category] === id ? null : id },
    })),

  unlockMask: (id) => set((s) => ({ masks: { ...s.masks, [id]: true } })),

  collectCoinBubble: (id) =>
    set((s) =>
      s.collectedCoinBubbles.includes(id)
        ? s
        : { collectedCoinBubbles: [...s.collectedCoinBubbles, id] },
    ),

  popGem: (id) =>
    set((s) => (s.poppedGems.includes(id) ? s : { poppedGems: [...s.poppedGems, id] })),

  unlockSpecies: (id) =>
    set((s) =>
      s.unlockedSpeciesIds.includes(id)
        ? s
        : { unlockedSpeciesIds: [...s.unlockedSpeciesIds, id] },
    ),

  redeemShopItem: (key) => {
    const state = get();
    if (state.redeemedShopItems.includes(key)) return "already";
    const item = SHOP_ITEM_DEFS.find((i) => i.key === key);
    if (!item) return "already";
    const price = priceWithDiscount(item.cost, state);
    if (state.coins < price) return "insufficient";
    set((s) => ({
      coins: s.coins - price,
      redeemedShopItems: [...s.redeemedShopItems, key],
    }));
    return "ok";
  },

  setStreak: (streak) => set({ streak }),

  addRaffleEntries: (n) =>
    set((s) => {
      const add = Math.max(0, Math.round(n));
      const month = currentMonthKey();
      const entries = s.raffle.month === month ? s.raffle.entries + add : add;
      return { raffle: { month, entries } };
    }),

  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  hydrate: (state) => set((s) => ({ ...s, ...state, hydrated: true })),
  reset: () => set({ ...DEFAULT_ECONOMY }),
}));

/** Voyager mask applies a 15% discount to every Coin Shop price. */
export function priceWithDiscount(cost: number, state: Pick<EconomyState, "gear">): number {
  return state.gear.mask === "voyager" ? Math.round(cost * 0.85) : cost;
}
