import { create } from "zustand";
import {
  DEFAULT_ECONOMY,
  EconomyState,
  GearCategory,
  GearId,
  MaskId,
  SHOP_ITEM_DEFS,
} from "@snorkeling/shared";

export type RedeemResult = "ok" | "insufficient" | "already";

interface EconomyActions {
  /** True once the persisted state has been loaded (Phase 7). Starts true since
   *  there's no async load yet — the persistence layer flips it. */
  hydrated: boolean;

  earnCoins: (amount: number) => void;
  /** Returns false (and does nothing) if the balance can't cover it. */
  spendCoins: (amount: number) => boolean;

  /** Equip an item, or unequip it if it's already the equipped one. */
  toggleGear: (category: GearCategory, id: GearId) => void;
  unlockMask: (id: MaskId) => void;

  collectCoinBubble: (id: string) => void;
  unlockSpecies: (id: string) => void;

  redeemShopItem: (key: string) => RedeemResult;

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

  hydrate: (state) => set((s) => ({ ...s, ...state, hydrated: true })),
  reset: () => set({ ...DEFAULT_ECONOMY }),
}));

/** Voyager mask applies a 15% discount to every Coin Shop price. */
export function priceWithDiscount(cost: number, state: Pick<EconomyState, "gear">): number {
  return state.gear.mask === "voyager" ? Math.round(cost * 0.85) : cost;
}
