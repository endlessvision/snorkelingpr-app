import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Text } from "@/components/Text";
import { fontDisplay } from "@/theme/fonts";

export type BurstKind = "coin" | "xp";

interface Props {
  left: number;
  top: number;
  value: number;
  kind?: BurstKind;
  onDone: () => void;
}

/** The "+N coins" / "+N XP" pop-and-rise FX — ports @keyframes dvPop. */
export function CollectBurst({ left, top, value, kind = "coin", onDone }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) });
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 + progress.value * 1.1 }, { translateY: -progress.value * 26 }],
  }));

  const isXp = kind === "xp";

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { left, top }, style]}>
      <Text style={[styles.text, { color: isXp ? "#7fe6ef" : "#ffe58a" }]}>
        +{value}{isXp ? " XP ✨" : " 🪙"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute" },
  text: {
    fontFamily: fontDisplay.bold,
    fontSize: 18,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
