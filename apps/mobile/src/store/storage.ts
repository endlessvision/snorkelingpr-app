import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_ECONOMY, EconomyState } from "@snorkeling/shared";

const STORAGE_KEY = "snorkeling.economy.v1";

/**
 * The seam between the app and where the economy lives. Today it's on-device
 * (AsyncStorage); a later phase can implement this same interface against the
 * backend (06-backend.md) without touching the store or any UI.
 */
export interface EconomyStorage {
  load(): Promise<Partial<EconomyState> | null>;
  save(state: EconomyState): Promise<void>;
}

/** Persist only the domain slice — never the actions on the store. */
function pickDomain(state: EconomyState): EconomyState {
  return {
    coins: state.coins,
    gear: state.gear,
    masks: state.masks,
    redeemedShopItems: state.redeemedShopItems,
    collectedCoinBubbles: state.collectedCoinBubbles,
    unlockedSpeciesIds: state.unlockedSpeciesIds,
  };
}

export const asyncStorageEconomy: EconomyStorage = {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<EconomyState>;
      // Merge over defaults so new fields added later can't crash old saves.
      return { ...DEFAULT_ECONOMY, ...parsed };
    } catch {
      return null;
    }
  },

  async save(state) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pickDomain(state)));
    } catch {
      // Best-effort — a failed write shouldn't break gameplay.
    }
  },
};
