import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_ECONOMY, EconomyState } from "@snorkeling/shared";
import { currentMonthKey, currentWeekKey } from "@/lib/periods";

const STORAGE_KEY = "snorkeling.economy.v1";
/** Schema version of the persisted blob — bump when the shape needs a migration. */
const SCHEMA_VERSION = 2;

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
    xp: state.xp,
    weekXp: state.weekXp,
    gear: state.gear,
    masks: state.masks,
    redeemedShopItems: state.redeemedShopItems,
    collectedCoinBubbles: state.collectedCoinBubbles,
    poppedGems: state.poppedGems,
    unlockedSpeciesIds: state.unlockedSpeciesIds,
    streak: state.streak,
    freeSpins: state.freeSpins,
    raffle: state.raffle,
    muted: state.muted,
  };
}

/** Reset the weekly/monthly counters if their period no longer matches "now". */
function applyPeriodRollover(state: EconomyState): EconomyState {
  const week = currentWeekKey();
  const month = currentMonthKey();
  return {
    ...state,
    weekXp: state.weekXp.week === week ? state.weekXp : { week, xp: 0 },
    raffle: state.raffle.month === month ? state.raffle : { month, entries: 0 },
  };
}

export const asyncStorageEconomy: EconomyStorage = {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<EconomyState> & { version?: number };
      // Merge over defaults so older saves (missing new fields) can't crash.
      const merged: EconomyState = { ...DEFAULT_ECONOMY, ...parsed };
      return applyPeriodRollover(merged);
    } catch {
      return null;
    }
  },

  async save(state) {
    try {
      const payload = { version: SCHEMA_VERSION, ...pickDomain(state) };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Best-effort — a failed write shouldn't break gameplay.
    }
  },
};
