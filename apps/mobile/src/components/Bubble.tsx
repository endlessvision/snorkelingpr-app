import { useEffect } from "react";
import { DimensionValue, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { tideEasing } from "@/theme/tokens";

interface Props {
  left: DimensionValue;
  top: DimensionValue;
  size?: number;
  /** How far the bubble rises before looping back, in px. */
  rise?: number;
  durationMs?: number;
  delayMs?: number;
  color?: string;
}

const easing = Easing.bezier(tideEasing.x1, tideEasing.y1, tideEasing.x2, tideEasing.y2);

/** Ambient rising bubble — ports @keyframes bubbleRise / dvRise / splashBubble. */
export function Bubble({
  left,
  top,
  size = 8,
  rise = 120,
  durationMs = 5500,
  delayMs = 0,
  color = "rgba(255,255,255,0.55)",
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs, easing }), -1, false),
    );
  }, [delayMs, durationMs, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -progress.value * rise;
    const scale = 0.6 + progress.value * 0.4;
    const opacity = progress.value < 0.15 ? progress.value / 0.15 : 1 - (progress.value - 0.15) / 0.85;
    return {
      transform: [{ translateY }, { scale }],
      opacity: Math.max(0, opacity) * 0.8,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubble,
        { left, top, width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bubble: { position: "absolute" },
});
