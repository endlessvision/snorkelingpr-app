import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { MarineCreature } from "@/svg/MarineCreature";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { theme } from "@/theme/tokens";
import { useEconomy } from "@/store/useEconomy";
import { TOTAL_SPECIES } from "@/features/collection/species";

// No accounts yet (auth is deferred) — the app ships with a demo explorer profile.
const EXPLORER = { name: "Maya Rivera", initial: "M", memberSince: "2024" };

const LEVELS = [
  { min: 15, title: "Reef Guardian", lvl: 4 },
  { min: 10, title: "Reef Ranger", lvl: 3 },
  { min: 5, title: "Reef Explorer", lvl: 2 },
  { min: 0, title: "Snorkel Novice", lvl: 1 },
];

const STAMPS = [
  { site: "ICACOS", date: "JUN '24", creature: "fish" as const, color: "#16c0d8", bg: "#f3fbfc", rotate: "-8deg", locked: false },
  { site: "VIEQUES", date: "AUG '24", creature: "turtle" as const, color: "#e0218a", bg: "#fff5fa", rotate: "6deg", locked: false },
  { site: "BIO BAY", date: "LOCKED", creature: "jelly" as const, color: "#a9bcc2", bg: "#f6f9fa", rotate: "0deg", locked: true },
];

const CREW = [
  { name: "Capt. Dante", initial: "D", color: "#0a8fb6" },
  { name: "Hecmar", initial: "H", color: "#ff2e93" },
  { name: "Cristian", initial: "C", color: "#ffb000" },
  { name: "Sandra", initial: "S", color: "#1fc8a8" },
];

export default function PassportScreen() {
  const insets = useSafeAreaInsets();
  const species = useEconomy((s) => s.unlockedSpeciesIds.length);
  const level = LEVELS.find((l) => species >= l.min) ?? LEVELS[LEVELS.length - 1];

  const stats = [
    { value: "3", label: "TOURS", color: "#0a8fb6" },
    { value: String(species), label: "SPECIES", color: "#ff2e93" },
    { value: "142", label: "MILES", color: "#0a8fb6" },
    { value: "2", label: "YEARS", color: "#ffb000" },
  ];

  return (
    <View style={[styles.fill, { backgroundColor: "#eef7f9" }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        {/* cover header */}
        <LinearGradient colors={["#0a4f70", "#0a3a5c"]} style={[styles.cover, { paddingTop: insets.top + 8 }]}>
          <View style={styles.coverTurtle}>
            <MarineCreature kind="turtle" size={160} color="rgba(255,255,255,0.07)" />
          </View>
          <Text style={styles.coverLabel}>⚓ OCEAN PASSPORT</Text>
          <View style={styles.profileRow}>
            <LinearGradient colors={["#ff5bb0", "#ff2e93"]} style={styles.avatar}>
              <Text style={styles.avatarText}>{EXPLORER.initial}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{EXPLORER.name}</Text>
              <Text style={styles.member}>Explorer · Member since {EXPLORER.memberSince}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>
                  {level.title.toUpperCase()} · LVL {level.lvl}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* stats */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.progressNote}>
          {species} of {TOTAL_SPECIES} species logged
        </Text>

        {/* stamps */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESTINATION STAMPS</Text>
          <View style={styles.stampsRow}>
            {STAMPS.map((st) => (
              <View
                key={st.site}
                style={[
                  styles.stamp,
                  { borderColor: st.locked ? "#cfd9dd" : st.color, backgroundColor: st.bg, transform: [{ rotate: st.rotate }] },
                ]}
              >
                {st.locked ? (
                  <Text style={{ fontSize: 22, opacity: 0.4 }}>✨</Text>
                ) : (
                  <MarineCreature kind={st.creature} size={30} color={st.color} />
                )}
                <Text style={[styles.stampSite, { color: st.locked ? "#a9bcc2" : st.color }]}>{st.site}</Text>
                <Text style={[styles.stampDate, { color: st.locked ? "#a9bcc2" : st.color }]}>{st.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* crew */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CREW YOU&apos;VE MET</Text>
          <View style={styles.crewRow}>
            {CREW.map((c) => (
              <View key={c.name} style={styles.crewMember}>
                <View style={[styles.crewAvatar, { backgroundColor: c.color }]}>
                  <Text style={styles.crewInitial}>{c.initial}</Text>
                </View>
                <Text style={styles.crewName}>{c.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  cover: { paddingHorizontal: 24, paddingBottom: 26, overflow: "hidden" },
  coverTurtle: { position: "absolute", right: -20, top: -10 },
  coverLabel: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 2.5, color: "#ffd23f", marginTop: 8 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16 },
  avatar: { width: 62, height: 62, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontDisplay.bold, fontSize: 26, color: "#fff" },
  name: { fontFamily: fontDisplay.semiBold, fontSize: 24, color: "#fff", lineHeight: 26 },
  member: { fontFamily: fontBody.medium, fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  levelBadge: { alignSelf: "flex-start", marginTop: 5, backgroundColor: "#ffd23f", borderRadius: 100, paddingVertical: 3, paddingHorizontal: 9 },
  levelText: { fontFamily: fontLabel.extraBold, fontSize: 10, color: "#7a5a00" },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 18, marginTop: 16 },
  statCard: { flex: 1, alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 4 },
  statValue: { fontFamily: fontDisplay.bold, fontSize: 22 },
  statLabel: { fontFamily: fontLabel.extraBold, fontSize: 9, color: "#789", letterSpacing: 0.3 },
  progressNote: { fontFamily: fontLabel.bold, fontSize: 11, color: "#8aa0ab", textAlign: "center", marginTop: 8 },
  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionLabel: { fontFamily: fontLabel.bold, fontSize: 12, color: "#0a4f70", letterSpacing: 0.4, marginBottom: 9 },
  stampsRow: { flexDirection: "row", gap: 12 },
  stamp: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  stampSite: { fontFamily: fontLabel.extraBold, fontSize: 9, marginTop: 2 },
  stampDate: { fontFamily: fontLabel.bold, fontSize: 7 },
  crewRow: { flexDirection: "row", gap: 10 },
  crewMember: { alignItems: "center", width: 60 },
  crewAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  crewInitial: { fontFamily: fontDisplay.bold, fontSize: 15, color: "#fff" },
  crewName: { fontFamily: fontLabel.bold, fontSize: 9, color: "#567", marginTop: 4, textAlign: "center" },
});
