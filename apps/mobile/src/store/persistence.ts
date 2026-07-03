import { useEconomy } from "./useEconomy";
import { asyncStorageEconomy, EconomyStorage } from "./storage";

let unsubscribe: (() => void) | null = null;

/**
 * Load the persisted economy and keep it in sync. Call once at app start.
 * Order matters: we load and hydrate BEFORE subscribing, so we never write
 * the default state over a real save.
 */
export async function initEconomyPersistence(storage: EconomyStorage = asyncStorageEconomy): Promise<void> {
  const loaded = await storage.load();
  useEconomy.getState().hydrate(loaded ?? {});

  let debounce: ReturnType<typeof setTimeout> | null = null;
  unsubscribe?.();
  unsubscribe = useEconomy.subscribe((state) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      void storage.save(state);
    }, 250);
  });
}
