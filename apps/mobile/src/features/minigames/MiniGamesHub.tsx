import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { OverlayScreen, useUI } from "@/store/useUI";

interface GameRow {
  key: OverlayScreen;
  emoji: string;
  title: string;
  desc: string;
  bg: string;
  border: string;
  /** "free" shows a green FREE tag; "reels" shows the 🎁 FREE badge when a free spin is queued. */
  tag?: "free" | "reels";
}

const GAMES: GameRow[] = [
  { key: "coinRush", emoji: "⚡", title: "Coin Rush", desc: "Tap rising bubbles against the clock · earn coins", bg: "rgba(255,229,138,0.12)", border: "rgba(255,229,138,0.3)", tag: "free" },
  { key: "luckyReels", emoji: "🎰", title: "Lucky Reels", desc: "Match masks that boost your dives · 15 coins", bg: "rgba(255,46,147,0.14)", border: "rgba(255,46,147,0.32)", tag: "reels" },
  { key: "depthGamble", emoji: "🎲", title: "Depth Gamble", desc: "Bet & descend · cash out before the deep takes it", bg: "rgba(22,192,216,0.13)", border: "rgba(22,192,216,0.32)" },
  { key: "wheelOfTides", emoji: "🎡", title: "Wheel of Tides", desc: "Cheap spin · coins, gear or a rare discount · 8 coins", bg: "rgba(31,157,107,0.14)", border: "rgba(95,211,160,0.32)" },
  { key: "scratchSand", emoji: "🏖️", title: "Scratch-the-Sand", desc: "Rub the sand off · match 3 to win · 12 coins", bg: "rgba(244,201,61,0.14)", border: "rgba(244,201,61,0.34)" },
];

/** The Mini Games hub — opened from the + action menu. Shares the one economy. */
export function MiniGamesHub() {
  const visible = useUI((s) => s.screen === "miniGames");
  const close = useUI((s) => s.close);
  const open = useUI((s) => s.open);
  const coins = useEconomy((s) => s.coins);
  const freeSpins = useEconomy((s) => s.freeSpins);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={close}>
      <LinearGradient colors={["#0a4f70", "#06304a", "#02141f"]} locations={[0, 0.55, 1]} style={styles.fill}>
        <View style={styles.topBar}>
          <Pressable onPress={close} style={styles.backBtn}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
          <CoinPill coins={coins} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Mini Games</Text>
          <Text style={styles.subtitle}>
            Play with the coins you found underwater. Win more coins, diver&apos;s masks and rare tour prizes.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {GAMES.map((g) => (
            <Pressable key={g.key} onPress={() => open(g.key)} style={[styles.row, { backgroundColor: g.bg, borderColor: g.border }]}>
              <Text style={styles.rowEmoji}>{g.emoji}</Text>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{g.title}</Text>
                <Text style={styles.rowDesc}>{g.desc}</Text>
              </View>
              {g.tag === "free" && <Text style={styles.freeText}>FREE</Text>}
              {g.tag === "reels" && freeSpins > 0 && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>🎁 FREE</Text>
                </View>
              )}
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  header: { alignItems: "center", paddingHorizontal: 24, paddingTop: 8 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "center", marginTop: 2, maxWidth: 280 },
  list: { padding: 20, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 13, borderWidth: 1, borderRadius: 18, paddingVertical: 15, paddingHorizontal: 16 },
  rowEmoji: { fontSize: 30 },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fontLabel.extraBold, fontSize: 15, color: "#fff" },
  rowDesc: { fontFamily: fontBody.medium, fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 2 },
  freeText: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#7fffd0" },
  freeBadge: { backgroundColor: "#ffd23f", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 100 },
  freeBadgeText: { fontFamily: fontLabel.extraBold, fontSize: 10, color: "#5a3a06" },
  chevron: { fontFamily: fontLabel.extraBold, fontSize: 18, color: "rgba(255,255,255,0.6)" },
});
