import { useEconomy } from "@/store/useEconomy";

export type SoundName = "coin" | "xp" | "win" | "rankup" | "spin" | "lose";

/**
 * Sound seam. The handoff calls for win/coin/etc. sounds, but the app ships
 * without audio assets yet — this is a no-op that respects the `muted` flag so
 * the call sites are already correct. Drop in expo-audio + asset files here to
 * enable sound without touching any feature code.
 */
export function playSound(_name: SoundName): void {
  if (useEconomy.getState().muted) return;
  // TODO(sound): load and play assets/sfx/<name>.m4a via expo-audio.
}
