import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Bubble } from "./Bubble";
import { motion } from "@/theme/tokens";

const standardEase = Easing.bezier(0.4, 0, 0.2, 1);
const breatheEase = Easing.inOut(Easing.ease);

// splashSeq: 0% opacity 0 scale 1.06 -> 22% opacity 1 scale 1 -> 66% hold -> 96% opacity 0 scale .985 -> 100%
const FADE_IN_MS = motion.splashSequence * 0.22; // 616ms
const HOLD_MS = motion.splashSequence * (0.66 - 0.22); // 1232ms
const FADE_OUT_MS = motion.splashSequence * (1 - 0.66); // 952ms

interface Props {
  onDone: () => void;
  backgroundColor?: string;
  bubblesOn?: boolean;
}

/** Ports the splash sequence from design-reference/Snorkeling Opening.dc.html. */
export function SplashOverlay({ onDone, backgroundColor = "#870486", bubblesOn = true }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1.06);
  const breathe = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: FADE_IN_MS, easing: standardEase }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0, { duration: FADE_OUT_MS, easing: standardEase }),
    );
    scale.value = withSequence(
      withTiming(1, { duration: FADE_IN_MS, easing: standardEase }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0.985, { duration: FADE_OUT_MS, easing: standardEase }),
    );
    breathe.value = withRepeat(withTiming(1, { duration: motion.splashSequence / 2, easing: breatheEase }), -1, true);

    const t = setTimeout(onDone, motion.splashSequence + 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + breathe.value * 12 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { backgroundColor }, containerStyle]}
    >
      {bubblesOn && (
        <>
          <Bubble left="24%" top="82%" size={12} rise={260} durationMs={4500} />
          <Bubble left="62%" top="88%" size={8} rise={260} durationMs={5200} delayMs={800} />
          <Bubble left="46%" top="80%" size={6} rise={260} durationMs={4000} delayMs={1600} />
          <Bubble left="78%" top="76%" size={9} rise={260} durationMs={5600} delayMs={400} />
        </>
      )}
      <Animated.Image
        source={require("../../assets/snorkeling-logo.jpeg")}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "82%",
    maxWidth: 300,
    aspectRatio: 1,
    borderRadius: 24,
  },
});
