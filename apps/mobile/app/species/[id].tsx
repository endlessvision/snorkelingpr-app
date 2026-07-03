import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useCallback, useEffect } from "react";
import { Text } from "@/components/Text";
import { MarineCreature } from "@/svg/MarineCreature";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { theme } from "@/theme/tokens";
import { speciesById } from "@/features/collection/species";

const STARS: Record<number, string> = { 1: "★☆☆", 2: "★★☆", 3: "★★★" };

export default function SpeciesCard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const species = typeof id === "string" ? speciesById(id) : undefined;

  // Fall back to the Collection when there's no back-stack (deep-linked in).
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/collect");
  }, [router]);

  const sway = useSharedValue(0);
  useEffect(() => {
    sway.value = withRepeat(withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [sway]);
  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -sway.value * 12 }, { rotate: `${-3 + sway.value * 6}deg` }],
  }));

  if (!species) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text variant="display">Species not found</Text>
        <Pressable onPress={goBack}>
          <Text variant="body" color="#16c0d8">
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {/* hero */}
        <LinearGradient colors={[species.gradient[0], species.gradient[1], "#0a6e7e"]} style={[styles.hero, { paddingTop: insets.top }]}>
          <View style={styles.heroBar}>
            <Pressable onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <Text style={styles.heart}>♡</Text>
          </View>
          <Animated.View style={[styles.heroCreature, swayStyle]}>
            <MarineCreature kind={species.creature} size={200} />
          </Animated.View>
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>★ {species.rarity.toUpperCase()} FIND</Text>
          </View>
        </LinearGradient>

        {/* body */}
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.commonName}>{species.commonName}</Text>
              <Text style={styles.sciName}>{species.scientificName}</Text>
            </View>
            <View style={styles.audioBtn}>
              <Text style={{ fontSize: 16 }}>🔊</Text>
            </View>
          </View>

          {/* stat chips */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>DEPTH</Text>
              <Text style={styles.statValue}>
                {species.depthMinFt}–{species.depthMaxFt} ft
              </Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>SPOT IT</Text>
              <Text style={[styles.statValue, { color: "#ffb000" }]}>{STARS[species.spotDifficulty]}</Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: "#fff0f4" }]}>
              <Text style={[styles.statLabel, { color: "#d98" }]}>STATUS</Text>
              <Text style={[styles.statValue, styles.statusValue]} numberOfLines={2}>
                {species.conservationStatus}
              </Text>
            </View>
          </View>

          {/* fun fact */}
          <View style={styles.factCard}>
            <Text style={styles.factLabel}>💡 FUN FACT</Text>
            <Text style={styles.factText}>{species.funFact}</Text>
          </View>

          {/* where in PR */}
          <View style={styles.whereBlock}>
            <Text style={styles.whereLabel}>WHERE TO FIND IT IN PUERTO RICO</Text>
            <View style={styles.whereChips}>
              {species.foundAt.map((site) => (
                <View key={site} style={styles.whereChip}>
                  <Text style={styles.whereChipText}>📍 {site}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* first spotted */}
          <View style={styles.spottedCard}>
            <View style={styles.spottedIcon}>
              <Text style={{ fontSize: 18 }}>🏅</Text>
            </View>
            <View>
              <Text style={styles.spottedTitle}>First spotted by you</Text>
              <Text style={styles.spottedDesc}>Registered on your Ocean Passport</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#fff" },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: theme.bg },
  hero: { height: 360, overflow: "hidden" },
  heroBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22, height: 46 },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  heart: { color: "#fff", fontSize: 18 },
  heroCreature: { position: "absolute", left: 0, right: 0, top: "50%", marginTop: -100, alignItems: "center" },
  rarityBadge: { position: "absolute", top: 60, left: 22, backgroundColor: "#ffd23f", borderRadius: 100, paddingVertical: 6, paddingHorizontal: 12, transform: [{ rotate: "-4deg" }] },
  rarityText: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#7a5a00" },
  body: { paddingHorizontal: 22, paddingTop: 18 },
  nameRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  commonName: { fontFamily: fontDisplay.semiBold, fontSize: 27, color: "#0a4f70", lineHeight: 30 },
  sciName: { fontFamily: fontBody.medium, fontStyle: "italic", fontSize: 14, color: "#8aa0ab" },
  audioBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#16c0d8", alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 9, marginTop: 14 },
  statChip: { flex: 1, backgroundColor: "#f3fbfc", borderRadius: 14, paddingVertical: 11, paddingHorizontal: 8, alignItems: "center" },
  statLabel: { fontFamily: fontLabel.extraBold, fontSize: 9, color: "#9ab", letterSpacing: 0.3 },
  statValue: { fontFamily: fontDisplay.semiBold, fontSize: 15, color: "#0a8fb6", marginTop: 2 },
  statusValue: { fontSize: 12, color: "#e0218a", textAlign: "center" },
  factCard: { marginTop: 14, backgroundColor: "#eaf9fb", borderRadius: 16, padding: 14, borderLeftWidth: 4, borderLeftColor: "#16c0d8" },
  factLabel: { fontFamily: fontLabel.extraBold, fontSize: 10, color: "#0a8fb6", letterSpacing: 0.5 },
  factText: { fontFamily: fontBody.medium, fontSize: 13.5, lineHeight: 20, color: "#456", marginTop: 4 },
  whereBlock: { marginTop: 14 },
  whereLabel: { fontFamily: fontLabel.bold, fontSize: 11, color: "#0a4f70", letterSpacing: 0.4, marginBottom: 8 },
  whereChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  whereChip: { backgroundColor: "#e8fbfb", borderRadius: 100, paddingVertical: 7, paddingHorizontal: 13 },
  whereChipText: { fontFamily: fontLabel.bold, fontSize: 12, color: "#0a8fa6" },
  spottedCard: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "#0a4f70", borderRadius: 16, padding: 13 },
  spottedIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#ffd23f", alignItems: "center", justifyContent: "center" },
  spottedTitle: { fontFamily: fontLabel.bold, fontSize: 13, color: "#fff" },
  spottedDesc: { fontFamily: fontBody.medium, fontSize: 12, color: "rgba(255,255,255,0.82)" },
});
