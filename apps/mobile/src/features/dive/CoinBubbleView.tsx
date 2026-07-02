import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { CoinIcon } from "@/svg/CoinIcon";
import { Text } from "@/components/Text";
import { fontLabel } from "@/theme/fonts";

interface Props {
  left: number;
  top: number;
  value: number;
  onCollect: () => void;
}

const easing = Easing.inOut(Easing.ease);

/** A collectible coin bubble in the Dive world — ports the `dvCoinBob` bubble markup. */
export function CoinBubbleView({ left, top, value, onCollect }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1700, easing }), -1, true);
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.value * 8 }],
  }));

  return (
    <Pressable onPress={onCollect} style={[styles.touchArea, { left, top }]} hitSlop={6}>
      <Animated.View style={[styles.bubble, style]}>
        <View style={styles.glass} />
        <View style={styles.coinWrap}>
          <CoinIcon size={26} />
        </View>
        <Text style={styles.value}>+{value}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: { position: "absolute", width: 48, height: 48 },
  bubble: { width: 48, height: 48 },
  glass: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#ffd23f",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  coinWrap: { position: "absolute", left: 11, top: 11 },
  value: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 48,
    textAlign: "center",
    fontFamily: fontLabel.extraBold,
    fontSize: 10,
    color: "#fff6d8",
  },
});
