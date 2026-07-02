import { useEffect } from "react";
import { DimensionValue, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

interface Props {
  left: DimensionValue;
  width: number;
  height: number;
  skewDeg: number;
  durationMs?: number;
  delayMs?: number;
}

const easing = Easing.inOut(Easing.ease);

/** Caustic light ray — ports @keyframes dvRay / shimmer. */
export function SunRay({ left, width, height, skewDeg, durationMs = 6500, delayMs = 0 }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs, easing }), -1, true),
    );
  }, [delayMs, durationMs, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + progress.value * 0.35,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { left, width, height, transform: [{ skewX: `${skewDeg}deg` }] }, style]}
    >
      <LinearGradient colors={["rgba(255,255,255,0.5)", "transparent"]} style={styles.fill} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0 },
  fill: { flex: 1 },
});
