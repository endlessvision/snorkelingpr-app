import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/Text";
import { fontDisplay, fontLabel } from "@/theme/fonts";

interface Props {
  progress: SharedValue<number>;
  ft: number;
  zone: string;
}

/** The right-edge vertical depth gauge — ports the Dive HUD's fill bar + knob. */
export function DepthGauge({ progress, ft, zone }: Props) {
  const fillStyle = useAnimatedStyle(() => ({ height: `${progress.value * 100}%` }));
  const knobStyle = useAnimatedStyle(() => ({ top: `${progress.value * 100}%` }));

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.track}>
        <Animated.View style={[styles.fillWrap, fillStyle]}>
          <LinearGradient colors={["#7fe6ef", "#16c0d8"]} style={styles.fill} />
        </Animated.View>
        <Animated.View style={[styles.knob, knobStyle]} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.ft}>{ft} ft</Text>
        <Text style={styles.zone}>{zone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 120, bottom: 150, right: 14, alignItems: "flex-end" },
  track: { width: 6, flex: 1, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.22)" },
  fillWrap: { position: "absolute", left: 0, right: 0, bottom: 0, borderRadius: 100, overflow: "hidden" },
  fill: { flex: 1 },
  knob: {
    position: "absolute",
    left: -4,
    width: 14,
    height: 14,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: "#fff",
    shadowColor: "#7fe6ef",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  labels: { position: "absolute", top: -2, right: 16, alignItems: "flex-end" },
  ft: {
    fontFamily: fontDisplay.bold,
    fontSize: 15,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  zone: {
    fontFamily: fontLabel.extraBold,
    fontSize: 9,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
  },
});
