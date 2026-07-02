import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

interface Props {
  left: number;
  top: number;
  size?: number;
  color: string;
  durationMs?: number;
  delayMs?: number;
}

const easing = Easing.inOut(Easing.ease);

/** Bioluminescent dot in the Abyss — ports @keyframes dvBiolum. */
export function BiolumDot({ left, top, size = 6, color, durationMs = 3800, delayMs = 0 }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs, easing }), -1, true),
    );
  }, [delayMs, durationMs, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + progress.value * 0.65,
    transform: [{ scale: 0.8 + progress.value * 0.35 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dot,
        {
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
