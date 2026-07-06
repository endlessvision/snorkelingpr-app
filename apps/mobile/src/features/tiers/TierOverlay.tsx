import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIVER_TIERS, tierIndexFor, tierProgressPct, xpToNextTier } from "@snorkeling/shared";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** The Diver status tier overlay — hero medallion, progress card, full ladder. */
export function TierOverlay({ visible, onClose }: Props) {
  const xp = useEconomy((s) => s.xp);
  const idx = tierIndexFor(xp);
  const tier = DIVER_TIERS[idx];
  const hasNext = idx < DIVER_TIERS.length - 1;
  const next = hasNext ? DIVER_TIERS[idx + 1] : null;
  const pct = tierProgressPct(xp);
  const toNext = xpToNextTier(xp);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <LinearGradient colors={["#0a3a4a", "#0a5c74", "#02141f"]} locations={[0, 0.4, 1]} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topBar}>
            <Pressable onPress={onClose} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <View style={styles.xpPill}>
              <Text style={styles.xpPillText}>{xp} XP</Text>
            </View>
          </View>

          {/* current rank hero */}
          <View style={styles.hero}>
            <View style={[styles.medallion, { borderColor: tier.color, shadowColor: tier.color }]}>
              <Text style={styles.medallionIcon}>{tier.icon}</Text>
            </View>
            <Text style={styles.eyebrow}>YOUR RANK</Text>
            <Text style={styles.rankName}>{tier.name}</Text>
            <Text style={styles.tag}>{tier.tag}</Text>
          </View>

          {/* progress to next */}
          {hasNext && next && (
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>NEXT · {next.name}</Text>
                <Text style={styles.progressGo}>{toNext} XP to go</Text>
              </View>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={["#16c0d8", "#7fe6ef"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${pct}%` }]}
                />
              </View>
              <Text style={styles.progressHint}>
                Earn XP by logging sea life, keeping your streak, and winning games.
              </Text>
            </View>
          )}

          {/* ladder */}
          <View style={styles.ladder}>
            {DIVER_TIERS.map((t, i) => {
              const current = i === idx;
              const done = i < idx;
              const locked = i > idx;
              return (
                <View
                  key={t.name}
                  style={[
                    styles.rung,
                    {
                      backgroundColor: current ? "rgba(255,210,63,0.1)" : "rgba(255,255,255,0.05)",
                      borderColor: current ? "rgba(255,210,63,0.5)" : "rgba(255,255,255,0.14)",
                      opacity: locked ? 0.62 : 1,
                    },
                  ]}
                >
                  <View style={styles.rungIcon}>
                    <Text style={{ fontSize: 24 }}>{t.icon}</Text>
                  </View>
                  <View style={styles.rungText}>
                    <View style={styles.rungNameRow}>
                      <Text style={styles.rungName}>{t.name}</Text>
                      <Text style={styles.rungXp}>{t.xp}+ XP</Text>
                    </View>
                    <Text style={styles.rungPerk}>{t.perk}</Text>
                  </View>
                  {current && <Text style={styles.you}>★ YOU</Text>}
                  {done && <Text style={styles.done}>✓</Text>}
                  {locked && <Text style={styles.locked}>🔒</Text>}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingTop: 52, paddingBottom: 34 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  xpPill: { backgroundColor: "rgba(3,30,44,0.5)", borderWidth: 1, borderColor: "rgba(255,255,255,0.28)", paddingVertical: 7, paddingHorizontal: 13, borderRadius: 100 },
  xpPillText: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#7fe6ef" },
  hero: { alignItems: "center", paddingHorizontal: 24, paddingTop: 10 },
  medallion: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  medallionIcon: { fontSize: 44 },
  eyebrow: { fontFamily: fontLabel.extraBold, fontSize: 10, letterSpacing: 1.4, color: "#7fe6ef", marginTop: 10 },
  rankName: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff", lineHeight: 33 },
  tag: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  progressCard: { marginHorizontal: 20, marginTop: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 16, padding: 14 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "rgba(255,255,255,0.7)" },
  progressGo: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#ffe58a" },
  progressTrack: { height: 10, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 100 },
  progressHint: { fontFamily: fontBody.medium, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 8 },
  ladder: { paddingHorizontal: 20, paddingTop: 18, gap: 10 },
  rung: { flexDirection: "row", alignItems: "center", gap: 13, borderWidth: 1.5, borderRadius: 16, padding: 13 },
  rungIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  rungText: { flex: 1 },
  rungNameRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  rungName: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  rungXp: { fontFamily: fontLabel.extraBold, fontSize: 9, letterSpacing: 0.5, color: "#7fe6ef" },
  rungPerk: { fontFamily: fontBody.medium, fontSize: 11.5, color: "rgba(255,255,255,0.75)", lineHeight: 16, marginTop: 2 },
  you: { fontFamily: fontLabel.extraBold, fontSize: 10, color: "#ffd23f" },
  done: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#7fffd0" },
  locked: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "rgba(255,255,255,0.4)" },
});
