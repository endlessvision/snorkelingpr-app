import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PhoneSafeArea } from "@/components/PhoneSafeArea";
import { Text } from "@/components/Text";
import { MarineCreature } from "@/svg/MarineCreature";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { theme } from "@/theme/tokens";
import { useEconomy } from "@/store/useEconomy";
import { CATEGORY_LABEL, SPECIES, SpeciesEntry, TOTAL_SPECIES } from "@/features/collection/species";

export default function CollectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const unlockedIds = useEconomy((s) => s.unlockedSpeciesIds);
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const unlockedCount = unlockedIds.length;
  const progressPct = Math.round((unlockedCount / TOTAL_SPECIES) * 100);

  const categories = useMemo(() => {
    const cats: SpeciesEntry["category"][] = ["reef", "turtle", "shark", "ray", "other"];
    return cats
      .map((cat) => {
        const all = SPECIES.filter((s) => s.category === cat);
        const got = all.filter((s) => unlockedSet.has(s.id)).length;
        return { cat, total: all.length, got };
      })
      .filter((c) => c.total > 0);
  }, [unlockedSet]);

  const lastUnlocked = unlockedIds[unlockedIds.length - 1];
  const rareLeft = SPECIES.filter((s) => s.rarity === "rare" && !unlockedSet.has(s.id)).length;

  return (
    <PhoneSafeArea backgroundColor={theme.bg}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Text variant="display">My Collection</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={["#16c0d8", "#ff2e93"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${Math.max(2, progressPct)}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {unlockedCount} / {TOTAL_SPECIES}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {categories.map((c) => (
            <View key={c.cat} style={styles.chip}>
              <Text style={styles.chipText}>
                {CATEGORY_LABEL[c.cat]} · {c.got}/{c.total}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {SPECIES.map((s) => {
            const unlocked = unlockedSet.has(s.id);
            if (unlocked) {
              return (
                <Pressable key={s.id} style={styles.tile} onPress={() => router.push(`/species/${s.id}`)}>
                  <LinearGradient colors={s.gradient} style={styles.tileFill}>
                    <View style={styles.creatureWrap}>
                      <MarineCreature kind={s.creature} size={62} />
                    </View>
                    <Text style={styles.tileName} numberOfLines={1}>
                      {s.commonName}
                    </Text>
                    {s.id === lastUnlocked && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>★ NEW</Text>
                      </View>
                    )}
                  </LinearGradient>
                </Pressable>
              );
            }
            return (
              <View key={s.id} style={[styles.tile, styles.tileLocked]}>
                <MarineCreature kind={s.creature} size={56} color="#bcccd1" />
                <Text style={styles.lockedMark}>?</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.rareBanner}>
          <View style={styles.rareIcon}>
            <Text style={{ fontSize: 20 }}>🫧</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rareTitle}>
              {rareLeft > 0 ? `${rareLeft} rare discoveries left` : "All rare species found!"}
            </Text>
            <Text style={styles.rareDesc}>
              {unlockedCount === 0
                ? "Tap the + button to register your first sighting"
                : "Dive Vieques to find a Hawksbill turtle"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </PhoneSafeArea>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingTop: 6 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  progressTrack: { flex: 1, height: 12, borderRadius: 8, backgroundColor: "#dceef1", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 8 },
  progressText: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#ff2e93" },
  chipsRow: { marginTop: 16, marginHorizontal: -22, paddingHorizontal: 22 },
  chip: {
    backgroundColor: "#fff",
    borderRadius: 100,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 9,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  chipText: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#0a8fb6" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 16 },
  tile: {
    width: "31.5%",
    aspectRatio: 0.82,
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
  },
  tileFill: { flex: 1 },
  tileLocked: {
    backgroundColor: "#dce8eb",
    borderWidth: 2,
    borderColor: "#b9cdd3",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  creatureWrap: { position: "absolute", left: 0, right: 0, top: "36%", transform: [{ translateY: -31 }], alignItems: "center" },
  tileName: { position: "absolute", left: 8, right: 8, bottom: 8, fontFamily: fontLabel.extraBold, fontSize: 10, color: "#fff" },
  newBadge: { position: "absolute", top: 7, right: 7, backgroundColor: "#ffd23f", borderRadius: 6, paddingVertical: 2, paddingHorizontal: 6 },
  newBadgeText: { fontFamily: fontLabel.extraBold, fontSize: 8, color: "#7a5a00" },
  lockedMark: { position: "absolute", bottom: 8, fontFamily: fontLabel.extraBold, fontSize: 16, color: "#9fb4bb" },
  rareBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0a4f70",
    borderRadius: 18,
    padding: 14,
    marginTop: 4,
  },
  rareIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  rareTitle: { fontFamily: fontLabel.bold, fontSize: 13, color: "#fff" },
  rareDesc: { fontFamily: fontLabel.regular, fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 },
});
