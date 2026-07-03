import { useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CoinIcon } from "@/svg/CoinIcon";
import { GemIcon } from "@/svg/GemIcon";
import { UrchinIcon } from "@/svg/UrchinIcon";

export type EntityType = "coin" | "gem" | "urchin";

export interface CoinRushEntityData {
  id: number;
  type: EntityType;
  x: number;
  /** Spawn Y, just below the bottom edge. */
  startY: number;
  /** Exit Y, above the top edge (negative). */
  exitY: number;
  travelMs: number;
  value: number;
}

interface Props {
  data: CoinRushEntityData;
  onCatch: (data: CoinRushEntityData) => void;
  onMiss: (data: CoinRushEntityData) => void;
}

const SIZE = 46;

/** A single rising coin/gem/urchin in Coin Rush — ports the prototype's spawn()/loop(). */
export function CoinRushEntity({ data, onCatch, onMiss }: Props) {
  const progress = useSharedValue(0);
  const caught = useRef(false);

  useEffect(() => {
    progress.value = withTiming(1, { duration: data.travelMs, easing: Easing.linear }, (finished) => {
      if (finished && !caught.current) {
        runOnJS(onMiss)(data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: data.startY + progress.value * (data.exitY - data.startY) }],
  }));

  const handlePress = () => {
    if (caught.current) return;
    caught.current = true;
    onCatch(data);
  };

  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrap, { left: data.x }, style]}>
      <Pressable onPress={handlePress} hitSlop={8} style={styles.touch}>
        {data.type === "urchin" ? (
          <UrchinIcon size={SIZE - 8} />
        ) : data.type === "gem" ? (
          <GemIcon size={SIZE - 18} />
        ) : (
          <CoinIcon size={SIZE - 20} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0 },
  touch: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
