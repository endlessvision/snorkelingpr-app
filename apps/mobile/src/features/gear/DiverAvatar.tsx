import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { EquippedGear } from "@snorkeling/shared";
import { gearColor } from "@/theme/tokens";
import { Bubble } from "@/components/Bubble";

const DEFAULT_SUIT = "#8792a0";
const SKIN = "#e8b48c";

interface Props {
  gear: EquippedGear;
}

/** The diver avatar in the Gear locker — ports renderAvatar() from Snorkeling Dive.dc.html. */
export function DiverAvatar({ gear }: Props) {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [bob]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -bob.value * 9 }, { rotate: `${-1.6 + bob.value * 3.2}deg` }],
  }));

  const suit = gear.suit ? gearColor.suit[gear.suit] : DEFAULT_SUIT;
  const finC = gear.fins ? gearColor.fins[gear.fins] : null;
  const maskC = gear.mask ? gearColor.mask[gear.mask] : null;
  const flagC = gear.flag ? gearColor.flag[gear.flag] : null;

  return (
    <Animated.View style={[styles.container, style]}>
      {/* flag */}
      {flagC && (
        <>
          <View style={[styles.flagPole]} />
          <View style={[styles.flag, { backgroundColor: flagC }]} />
        </>
      )}

      {/* legs */}
      <View style={[styles.legLeft, { backgroundColor: suit }]} />
      <View style={[styles.legRight, { backgroundColor: suit }]} />

      {/* fins */}
      {finC && (
        <>
          <View style={[styles.finLeft, { backgroundColor: finC }]} />
          <View style={[styles.finRight, { backgroundColor: finC }]} />
        </>
      )}

      {/* arms */}
      <View style={[styles.armLeft, { backgroundColor: suit }]} />
      <View style={[styles.armRight, { backgroundColor: suit }]} />

      {/* body + neck */}
      <View style={[styles.body, { backgroundColor: suit }]} />
      <View style={[styles.neck, { backgroundColor: suit }]} />

      {/* head */}
      <View style={styles.head} />

      {/* snorkel + bubbles */}
      <View style={styles.snorkel} />
      <Bubble left={100} top={6} size={6} rise={46} durationMs={2800} />
      <Bubble left={104} top={2} size={4} rise={46} durationMs={3400} delayMs={700} />

      {/* mask or eyes */}
      {maskC ? (
        <>
          <View style={[styles.maskBand, { backgroundColor: maskC }]} />
          <View style={styles.maskLens} />
        </>
      ) : (
        <>
          <View style={[styles.eye, { left: 64 }]} />
          <View style={[styles.eye, { left: 86 }]} />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { width: 160, height: 214 },
  flagPole: { position: "absolute", left: 122, top: 12, width: 5, height: 150, borderRadius: 3, backgroundColor: "#6b4a2a" },
  flag: { position: "absolute", left: 88, top: 12, width: 38, height: 26, borderRadius: 3 },
  legLeft: { position: "absolute", left: 56, top: 128, width: 18, height: 62, borderRadius: 9 },
  legRight: { position: "absolute", left: 82, top: 128, width: 18, height: 62, borderRadius: 9 },
  finLeft: {
    position: "absolute",
    left: 38,
    top: 180,
    width: 38,
    height: 24,
    borderRadius: 14,
    transform: [{ rotate: "-14deg" }],
  },
  finRight: {
    position: "absolute",
    left: 84,
    top: 180,
    width: 38,
    height: 24,
    borderRadius: 14,
    transform: [{ rotate: "14deg" }],
  },
  armLeft: {
    position: "absolute",
    left: 29,
    top: 60,
    width: 18,
    height: 60,
    borderRadius: 9,
    transform: [{ rotate: "9deg" }],
  },
  armRight: {
    position: "absolute",
    left: 109,
    top: 60,
    width: 18,
    height: 60,
    borderRadius: 9,
    transform: [{ rotate: "-9deg" }],
  },
  body: { position: "absolute", left: 46, top: 56, width: 64, height: 80, borderRadius: 20 },
  neck: { position: "absolute", left: 66, top: 48, width: 24, height: 16, borderRadius: 7 },
  head: { position: "absolute", left: 55, top: 8, width: 46, height: 46, borderRadius: 23, backgroundColor: SKIN },
  snorkel: { position: "absolute", left: 99, top: 12, width: 5, height: 30, borderRadius: 3, backgroundColor: "#f4c93d" },
  maskBand: { position: "absolute", left: 52, top: 18, width: 52, height: 20, borderRadius: 10 },
  maskLens: { position: "absolute", left: 58, top: 22, width: 40, height: 12, borderRadius: 7, backgroundColor: "#0a2a3a", opacity: 0.88 },
  eye: { position: "absolute", top: 24, width: 6, height: 6, borderRadius: 3, backgroundColor: "#0a2a3a" },
});
