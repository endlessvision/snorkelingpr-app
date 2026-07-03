import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { PhoneSafeArea } from "@/components/PhoneSafeArea";
import { Bubble } from "@/components/Bubble";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { MarineCreature } from "@/svg/MarineCreature";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { SPECIES, SpeciesEntry } from "@/features/collection/species";

/** Register-a-sighting flow reached from the + tab — unlocks the next species with a celebration. */
export default function SightingScreen() {
  const router = useRouter();
  const unlockedIds = useEconomy((s) => s.unlockedSpeciesIds);
  const unlockSpecies = useEconomy((s) => s.unlockSpecies);

  const [discovered, setDiscovered] = useState<SpeciesEntry | null>(null);
  const [allFound, setAllFound] = useState(false);
  const pop = useSharedValue(0);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    const next = SPECIES.find((s) => !unlockedIds.includes(s.id));
    if (!next) {
      setAllFound(true);
      return;
    }
    unlockSpecies(next.id);
    setDiscovered(next);
    pop.value = withSequence(
      withTiming(1.15, { duration: 340, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 220, easing: Easing.inOut(Easing.ease) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }], opacity: pop.value > 0 ? 1 : 0 }));

  const viewSpecies = useCallback(() => {
    if (discovered) router.replace(`/species/${discovered.id}`);
  }, [discovered, router]);

  return (
    <PhoneSafeArea gradient={{ colors: ["#0a4f70", "#0a3a5c"] }}>
      <View style={styles.center}>
        <Bubble left="20%" top="80%" size={10} rise={200} durationMs={4600} />
        <Bubble left="70%" top="76%" size={7} rise={200} durationMs={5200} delayMs={700} />
        <Bubble left="48%" top="84%" size={12} rise={200} durationMs={4200} delayMs={1400} />

        {allFound ? (
          <>
            <Text style={styles.bigEmoji}>🏆</Text>
            <Text style={styles.eyebrow}>OCEAN MASTER</Text>
            <Text style={styles.title}>You&apos;ve found every species!</Text>
            <Text variant="body" color="rgba(255,255,255,0.82)" style={styles.desc}>
              Your Ocean Passport is complete. Keep diving for coins and gear.
            </Text>
            <Button label="Back to the reef" onPress={() => router.back()} />
          </>
        ) : discovered ? (
          <>
            <Text style={styles.eyebrow}>NEW SPECIES DISCOVERED</Text>
            <Animated.View style={[styles.discCircle, popStyle]}>
              <LinearGradient colors={discovered.gradient} style={styles.discFill}>
                <MarineCreature kind={discovered.creature} size={120} />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.title}>{discovered.commonName}</Text>
            <Text style={styles.sci}>{discovered.scientificName}</Text>
            <View style={styles.rarityBadge}>
              <Text style={styles.rarityText}>★ {discovered.rarity.toUpperCase()} FIND</Text>
            </View>
            <View style={styles.buttons}>
              <Button label="See its card" onPress={viewSpecies} />
              <Button label="Done" onPress={() => router.back()} variant="glass" />
            </View>
          </>
        ) : null}
      </View>
    </PhoneSafeArea>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 },
  bigEmoji: { fontSize: 56 },
  eyebrow: { fontFamily: fontLabel.bold, fontSize: 12, letterSpacing: 2, color: "#7fe6ef", marginBottom: 8 },
  discCircle: { width: 180, height: 180, borderRadius: 90, overflow: "hidden", marginBottom: 12 },
  discFill: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 28, color: "#fff", textAlign: "center" },
  sci: { fontFamily: fontLabel.regular, fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.7)" },
  rarityBadge: { backgroundColor: "#ffd23f", borderRadius: 100, paddingVertical: 6, paddingHorizontal: 14, marginTop: 12 },
  rarityText: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#7a5a00" },
  desc: { textAlign: "center", marginVertical: 10 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 22 },
});
