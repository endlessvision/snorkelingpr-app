import { ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

export type DriftType = "bob" | "sway" | "swim" | "glide";

interface Props {
  left: number;
  top: number;
  type: DriftType;
  durationMs: number;
  delayMs?: number;
  children: ReactNode;
}

const easing = Easing.inOut(Easing.ease);

/** Ports @keyframes dvBob / dvSway / dvSwim / dvGlide as a positioned wrapper. */
export function Drift({ left, top, type, durationMs, delayMs = 0, children }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing }), -1, true),
    );
  }, [delayMs, durationMs, progress]);

  const style = useAnimatedStyle(() => {
    switch (type) {
      case "bob":
        return { transform: [{ translateY: -progress.value * 9 }] };
      case "sway":
        return {
          transform: [{ translateY: -progress.value * 12 }, { rotate: `${-4 + progress.value * 8}deg` }],
        };
      case "swim":
        return { transform: [{ translateX: progress.value * 26 }] };
      case "glide":
        return { transform: [{ translateX: -14 + progress.value * 30 }] };
      default:
        return {};
    }
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { left, top }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute" },
});
