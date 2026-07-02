import { ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { tideEasing } from "@/theme/tokens";

const easing = Easing.bezier(tideEasing.x1, tideEasing.y1, tideEasing.x2, tideEasing.y2);

/**
 * Ports @keyframes homeReveal — the screen underneath the splash fades/scales
 * in starting 2.25s after mount, finishing right as the splash overlay fades out.
 */
export function HomeReveal({ children }: { children: ReactNode }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(2250, withTiming(1, { duration: 600, easing }));
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 1.015 - progress.value * 0.015 }],
  }));

  return <Animated.View style={[styles.fill, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
