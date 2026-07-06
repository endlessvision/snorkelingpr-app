import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DIVER_TIERS } from "@snorkeling/shared";
import { Text } from "@/components/Text";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { playSound } from "@/lib/sound";

/**
 * Global rank-up banner. Watches the store's transient `rankUp` (set by addXp
 * when a tier threshold is crossed) so it shows no matter which screen earned
 * the XP, then clears it.
 */
export function RankUpToast() {
  const insets = useSafeAreaInsets();
  const rankUp = useEconomy((s) => s.rankUp);
  const clearRankUp = useEconomy((s) => s.clearRankUp);
  const [shown, setShown] = useState<number | null>(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    if (rankUp === null) return;
    setShown(rankUp);
    playSound("rankup");
    clearRankUp();
    progress.value = withSequence(
      withTiming(1, { duration: 320, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 2200 }),
      withTiming(0, { duration: 360, easing: Easing.in(Easing.ease) }, (finished) => {
        if (finished) runOnJS(setShown)(null);
      }),
    );
  }, [rankUp, clearRankUp, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -20 }],
  }));

  if (shown === null) return null;
  const tier = DIVER_TIERS[shown];

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { top: insets.top + 8 }, style]}>
      <Text style={styles.icon}>{tier.icon}</Text>
      <Text style={styles.label}>
        <Text style={styles.rankUp}>Rank up! </Text>
        You are now {tier.name}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "center",
    backgroundColor: "rgba(3,30,44,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,210,63,0.6)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: { fontSize: 26 },
  label: { flex: 1, fontFamily: fontLabel.bold, fontSize: 14, color: "#fff" },
  rankUp: { fontFamily: fontDisplay.bold, color: "#ffd23f" },
});
