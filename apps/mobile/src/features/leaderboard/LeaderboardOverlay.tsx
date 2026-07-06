import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIVER_TIERS, tierIndexFor } from "@snorkeling/shared";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { currentWeekKey, weekResetDate } from "@/lib/periods";

const RIVAL_NAMES = [
  "Diego", "Lucía", "Marco", "Sofía", "Tomás", "Valeria", "Hecmar", "Cristina",
  "Rafa", "Nina", "Bruno", "Elena", "Paolo", "Marisol", "Andrés", "Carmen",
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** mulberry32 seeded PRNG so the board is stable within a week. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Row {
  name: string;
  xp: number;
  you: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

/** Weekly leaderboard — ranks divers by XP earned this ISO week. Rivals are
 *  deterministic per week key (no backend), the player is inserted by weekXp. */
export function LeaderboardOverlay() {
  const visible = useUI((s) => s.screen === "leaderboard");
  const close = useUI((s) => s.close);

  const coins = useEconomy((s) => s.coins);
  const xp = useEconomy((s) => s.xp);
  const weekXp = useEconomy((s) => s.weekXp.xp);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, [visible]);

  const weekKey = currentWeekKey(now);

  const rows = useMemo<Row[]>(() => {
    const rng = seeded(hashStr(weekKey));
    const names = [...RIVAL_NAMES].sort(() => rng() - 0.5).slice(0, 9);
    const rivals: Row[] = names.map((name) => ({ name, xp: 30 + Math.floor(rng() * 360), you: false }));
    rivals.push({ name: "You (Maya)", xp: weekXp, you: true });
    return rivals.sort((a, b) => b.xp - a.xp);
  }, [weekKey, weekXp]);

  const reset = weekResetDate(now);
  const remMs = Math.max(0, reset.getTime() - now.getTime());
  const days = Math.floor(remMs / 86400000);
  const hours = Math.floor((remMs % 86400000) / 3600000);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={close}>
      <LinearGradient colors={["#3a1e6e", "#2a1550", "#02141f"]} locations={[0, 0.45, 1]} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable onPress={close} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <CoinPill coins={coins} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>This Week&apos;s Divers</Text>
            <Text style={styles.subtitle}>Earn the most XP by Sunday night. Top 3 win bonus raffle tickets.</Text>
          </View>

          <View style={styles.strip}>
            <View style={styles.stripCol}>
              <Text style={styles.stripLabel}>RESETS IN</Text>
              <Text style={styles.stripValue}>{days}d {hours}h</Text>
            </View>
            <View style={styles.stripDivider} />
            <View style={styles.stripCol}>
              <Text style={styles.stripLabel}>PRIZES</Text>
              <Text style={styles.stripValue}>🥇15 · 🥈8 · 🥉4</Text>
            </View>
          </View>

          <View style={styles.list}>
            {rows.map((r, i) => {
              const tier = DIVER_TIERS[tierIndexFor(r.you ? xp : r.xp)];
              return (
                <View key={r.name} style={[styles.row, r.you && styles.rowYou]}>
                  <Text style={styles.rank}>{i < 3 ? MEDALS[i] : `#${i + 1}`}</Text>
                  <View style={[styles.avatar, { backgroundColor: r.you ? "#ff2e93" : "#0a8fb6" }]}>
                    <Text style={styles.avatarText}>{r.name.replace("You (", "").charAt(0)}</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowName, r.you && styles.rowNameYou]}>{r.name}</Text>
                    <Text style={styles.rowTier}>{tier.icon} {tier.name}</Text>
                  </View>
                  <Text style={styles.rowXp}>{r.xp} XP</Text>
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
  content: { paddingBottom: 40 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  header: { alignItems: "center", paddingHorizontal: 24, paddingTop: 8 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "center", marginTop: 2, maxWidth: 290 },
  strip: { flexDirection: "row", marginHorizontal: 20, marginTop: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 14, padding: 12 },
  stripCol: { flex: 1, alignItems: "center" },
  stripDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.16)" },
  stripLabel: { fontFamily: fontLabel.extraBold, fontSize: 9, letterSpacing: 1, color: "rgba(255,255,255,0.55)" },
  stripValue: { fontFamily: fontDisplay.semiBold, fontSize: 18, color: "#fff", marginTop: 2 },
  list: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 11 },
  rowYou: { backgroundColor: "rgba(255,46,147,0.16)", borderWidth: 1, borderColor: "rgba(255,46,147,0.5)" },
  rank: { width: 30, textAlign: "center", fontFamily: fontLabel.extraBold, fontSize: 15, color: "#fff" },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontDisplay.bold, fontSize: 15, color: "#fff" },
  rowText: { flex: 1 },
  rowName: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  rowNameYou: { color: "#ffd6ea" },
  rowTier: { fontFamily: fontBody.medium, fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 1 },
  rowXp: { fontFamily: fontDisplay.semiBold, fontSize: 15, color: "#ffe58a" },
});
