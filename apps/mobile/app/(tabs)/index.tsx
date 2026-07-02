import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withDecay,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { depthZoneForFt, DepthZoneName } from "@snorkeling/shared";
import { HomeReveal } from "@/components/HomeReveal";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontLabel } from "@/theme/fonts";
import { OceanWorld, WORLD_HEIGHT, WORLD_WIDTH } from "@/features/dive/OceanWorld";
import { DepthGauge } from "@/features/dive/DepthGauge";
import { RedeemSheet } from "@/features/redeem/RedeemSheet";

interface Burst {
  id: number;
  left: number;
  top: number;
  value: number;
}

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(max, Math.max(min, value));
}

export default function DiveScreen() {
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [coins, setCoins] = useState(0);
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [toast, setToast] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [ft, setFt] = useState(0);
  const [zone, setZone] = useState<DepthZoneName>("Surface");

  const burstIdRef = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialized = useRef(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const progress = useSharedValue(0);
  const viewportShared = useSharedValue({ w: 0, h: 0 });
  const hintOpacity = useSharedValue(1);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  }, []);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      viewportShared.value = { w: width, h: height };
      setViewport({ w: width, h: height });
      if (!initialized.current) {
        initialized.current = true;
        translateX.value = clamp((width - WORLD_WIDTH) / 2, width - WORLD_WIDTH, 0);
        translateY.value = 0;
        hintOpacity.value = withDelay(4320, withTiming(0, { duration: 1680, easing: Easing.out(Easing.ease) }));
      }
    },
    [hintOpacity, translateX, translateY, viewportShared],
  );

  const pan = Gesture.Pan()
    .minDistance(4)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const { w, h } = viewportShared.value;
      translateX.value = clamp(startX.value + e.translationX, w - WORLD_WIDTH, 0);
      translateY.value = clamp(startY.value + e.translationY, h - WORLD_HEIGHT, 0);
    })
    .onEnd((e) => {
      const { w, h } = viewportShared.value;
      translateX.value = withDecay({ velocity: e.velocityX, clamp: [w - WORLD_WIDTH, 0] });
      translateY.value = withDecay({ velocity: e.velocityY, clamp: [h - WORLD_HEIGHT, 0] });
    });

  const worldStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }));

  useAnimatedReaction(
    () => {
      const { h } = viewportShared.value;
      const denom = WORLD_HEIGHT - h;
      return denom > 0 ? clamp(-translateY.value / denom, 0, 1) : 0;
    },
    (prog, prevProg) => {
      progress.value = prog;
      if (prevProg === null || Math.abs(prog - prevProg) > 0.0015) {
        const nextFt = Math.round(prog * 165);
        runOnJS(setFt)(nextFt);
        runOnJS(setZone)(depthZoneForFt(nextFt));
      }
    },
  );

  const handleCollect = useCallback(
    (id: string, left: number, top: number, value: number) => {
      setCollected((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
      setCoins((c) => c + value);
      const burstId = ++burstIdRef.current;
      setBursts((prev) => [...prev, { id: burstId, left, top, value }]);
      showToast(`+${value} coins collected!`);
    },
    [showToast],
  );

  const handleBurstDone = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <View style={styles.fill} onLayout={onLayout}>
      <HomeReveal>
        <GestureDetector gesture={pan}>
          <View style={styles.fill} collapsable={false}>
            {viewport.w > 0 && (
              <Animated.View style={worldStyle}>
                <OceanWorld
                  collected={collected}
                  onCollect={handleCollect}
                  bursts={bursts}
                  onBurstDone={handleBurstDone}
                />
              </Animated.View>
            )}
          </View>
        </GestureDetector>

        {/* HUD */}
        <View style={styles.hud} pointerEvents="box-none">
          <View style={styles.hudTopRow} pointerEvents="box-none">
            <CoinPill coins={coins} />
            <Pressable onPress={() => setSheetOpen(true)} style={styles.redeemBtn}>
              <Text style={styles.redeemLabel}>🎁 Redeem</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => showToast("Coin Rush arrives in Phase 4!")}
            style={[styles.pillBtn, { top: 100 }]}
          >
            <Text style={styles.pillBtnLabel} color="#ffe58a">
              ⚡ Coin Rush
            </Text>
          </Pressable>
          <Pressable
            onPress={() => showToast("Gear locker arrives in Phase 5!")}
            style={[styles.pillBtn, { top: 140 }]}
          >
            <Text style={styles.pillBtnLabel} color="#bfefff">
              🤿 Gear
            </Text>
          </Pressable>

          <DepthGauge progress={progress} ft={ft} zone={zone} />

          {!!toast && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}

          <Animated.View style={[styles.hint, hintStyle]}>
            <Text style={styles.hintText}>↕ ↔ Drag to explore the reef · tap 🪙 bubbles</Text>
          </Animated.View>
        </View>
      </HomeReveal>

      <RedeemSheet visible={sheetOpen} coins={coins} onClose={() => setSheetOpen(false)} onStub={showToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hud: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  hudTopRow: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  redeemBtn: {
    backgroundColor: "#FF2E93",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  redeemLabel: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff" },
  pillBtn: {
    position: "absolute",
    left: 16,
    backgroundColor: "rgba(3,30,44,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 100,
  },
  pillBtnLabel: { fontFamily: fontLabel.extraBold, fontSize: 12 },
  toast: {
    position: "absolute",
    top: 150,
    left: "50%",
    transform: [{ translateX: -110 }],
    width: 220,
    backgroundColor: "rgba(3,30,44,0.9)",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  toastText: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff", textAlign: "center" },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 104,
    alignItems: "center",
  },
  hintText: {
    backgroundColor: "rgba(3,30,44,0.4)",
    color: "#fff",
    fontFamily: fontLabel.bold,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },
});
