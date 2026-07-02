import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { radius, theme } from "@/theme/tokens";

interface Props {
  visible: boolean;
  coins: number;
  onClose: () => void;
  /** Phase 3 stub — Lucky Reels/Depth Gamble/Coin Shop land in Phase 4-5. */
  onStub: (msg: string) => void;
}

const ROWS = [
  { key: "reels", emoji: "🎰", title: "Lucky Reels", desc: "Spin for a diver's mask that boosts your dives", colors: ["#7b52c9", "#ff2e93"] },
  { key: "depth", emoji: "🎲", title: "Depth Gamble", desc: "Bet coins, dive deep, cash out before the deep takes it", colors: ["#0a6389", "#16c0d8"] },
  { key: "shop", emoji: "🛍️", title: "Coin Shop", desc: "Trade coins for real perks & rewards", colors: ["#f4b62e", "#ff8a3d"] },
] as const;

/** Bottom sheet reached from the Dive HUD's 🎁 Redeem button — ports the prototype's Treasure Shop sheet. */
export function RedeemSheet({ visible, coins, onClose, onStub }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 320, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  }, [visible, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 400 }],
  }));

  if (!visible && progress.value === 0) return null;

  return (
    <View style={styles.overlay} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.fill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <Text style={styles.title}>Treasure Shop</Text>
          <CoinPill coins={coins} variant="dark" />
        </View>
        <Text variant="body" style={styles.subtitle}>
          Play with the coins you found underwater — or trade them for real perks.
        </Text>
        {ROWS.map((row) => (
          <Pressable
            key={row.key}
            onPress={() => {
              onClose();
              onStub(`${row.title} arrives soon!`);
            }}
          >
            <LinearGradient
              colors={row.colors as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.row}
            >
              <Text style={styles.rowEmoji}>{row.emoji}</Text>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowDesc}>{row.desc}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 },
  fill: { flex: 1 },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(3,20,32,0.5)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  grabber: {
    width: 42,
    height: 5,
    borderRadius: 100,
    backgroundColor: "#cbdde3",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 22, color: theme.text },
  subtitle: { marginBottom: 14, marginTop: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    marginBottom: 12,
  },
  rowEmoji: { fontSize: 26 },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  rowDesc: { fontFamily: fontLabel.regular, fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  chevron: { fontFamily: fontLabel.extraBold, fontSize: 18, color: "#fff" },
});
