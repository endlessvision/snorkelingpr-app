import { EquippedGear } from "@snorkeling/shared";

/**
 * Gameplay perk math, ported from Snorkeling Dive.dc.html. All functions are
 * pure — they take the equipped gear and return the modifier the caller applies.
 */

/** Coin Rush round length: Sunray Fins add 5s to the base 30s. */
export function coinRushDurationMs(gear: EquippedGear): number {
  return (gear.fins === "sunray" ? 35 : 30) * 1000;
}

/** Coin Rush urchins are harmless with the Reef Blue Suit. */
export function urchinsAreHarmless(gear: EquippedGear): boolean {
  return gear.suit === "reef";
}

/** Coin Rush end-of-round flat bonus: Diver Down Flag adds +5. */
export function coinRushFlagBonus(gear: EquippedGear): number {
  return gear.flag === "diver" ? 5 : 0;
}

/**
 * Coin Rush rare-spawn boost threshold: Explorer Mask or Alpha Flag raise the
 * gem-spawn cutoff from 0.32 to 0.44.
 */
export function coinRushRareBoost(gear: EquippedGear): number {
  return gear.mask === "explorer" || gear.flag === "alpha" ? 0.44 : 0.32;
}

/** Coin Rush per-catch value for a coin/gem, before the combo multiplier. */
export function coinRushCatchBase(gear: EquippedGear, type: "coin" | "gem", value: number): number {
  return value + (gear.fins === "aqua" && type === "coin" ? 1 : 0);
}

/** Coin Rush coin multiplier: Fortune Mask x1.5, Coral Fins x1.1 (stack). */
export function coinRushCoinMultiplier(gear: EquippedGear): number {
  return (gear.mask === "fortune" ? 1.5 : 1) * (gear.fins === "coral" ? 1.1 : 1);
}

/**
 * Value of a collected Dive-world coin bubble. Per the gear spec: Aqua Fins add
 * +1, Fortune Mask adds +50%.
 */
export function coinBubbleValue(gear: EquippedGear, baseValue: number): number {
  const withFins = baseValue + (gear.fins === "aqua" ? 1 : 0);
  return Math.round(withFins * (gear.mask === "fortune" ? 1.5 : 1));
}
