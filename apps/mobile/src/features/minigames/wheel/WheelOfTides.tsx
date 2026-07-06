import { useCallback, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { MaskId } from "@snorkeling/shared";
import { CoinPill } from "@/components/CoinPill";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { playSound } from "@/lib/sound";

const SPIN_COST = 8;
const SIZE = 260;
const R = SIZE / 2;

type SegKind = "coins" | "mask" | "discount";
interface Segment {
  kind: SegKind;
  value?: number;
  label: string;
  color: string;
}

// 8 wedges, clockwise from 12 o'clock. Mostly coins, one mask, one thin discount.
const SEGMENTS: Segment[] = [
  { kind: "coins", value: 5, label: "+5", color: "#16c0d8" },
  { kind: "coins", value: 10, label: "+10", color: "#0a8fb6" },
  { kind: "mask", label: "MASK", color: "#ff2e93" },
  { kind: "coins", value: 5, label: "+5", color: "#0a6389" },
  { kind: "coins", value: 15, label: "+15", color: "#16c0d8" },
  { kind: "coins", value: 8, label: "+8", color: "#0a8fb6" },
  { kind: "discount", label: "🎟️", color: "#ffd23f" },
  { kind: "coins", value: 20, label: "+20", color: "#0a6389" },
];
// Weighted odds (discount is the thin slice).
const WEIGHTS = [5, 4, 2, 5, 3, 4, 1, 2];

function pickIndex(): number {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    r -= WEIGHTS[i];
    if (r < 0) return i;
  }
  return 0;
}

function wedgePath(i: number): string {
  const a0 = ((i * 45 - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * 45 - 90) * Math.PI) / 180;
  const x0 = R + R * Math.cos(a0);
  const y0 = R + R * Math.sin(a0);
  const x1 = R + R * Math.cos(a1);
  const y1 = R + R * Math.sin(a1);
  return `M ${R} ${R} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

function labelPos(i: number): { x: number; y: number } {
  const mid = ((i * 45 + 22.5 - 90) * Math.PI) / 180;
  return { x: R + R * 0.62 * Math.cos(mid), y: R + R * 0.62 * Math.sin(mid) };
}

/** Wheel of Tides — a cheap casual spin (8 coins) with transparent odds. */
export function WheelOfTides() {
  const visible = useUI((s) => s.screen === "wheelOfTides");
  const close = useUI((s) => s.close);

  const coins = useEconomy((s) => s.coins);
  const masks = useEconomy((s) => s.masks);
  const spendCoins = useEconomy((s) => s.spendCoins);
  const earnCoins = useEconomy((s) => s.earnCoins);
  const unlockMask = useEconomy((s) => s.unlockMask);
  const grantRedemption = useEconomy((s) => s.grantRedemption);

  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");
  const rotation = useSharedValue(0);
  const turns = useRef(0);

  const resolve = useCallback(
    (index: number) => {
      const seg = SEGMENTS[index];
      if (seg.kind === "coins" && seg.value) {
        earnCoins(seg.value);
        setMessage(`The tide brings +${seg.value} coins 🪙`);
      } else if (seg.kind === "mask") {
        const unowned = (["explorer", "fortune", "voyager"] as MaskId[]).filter((m) => !masks[m]);
        if (unowned.length) {
          const won = unowned[Math.floor(Math.random() * unowned.length)];
          unlockMask(won);
          setMessage(`🎉 You won a diver's mask! Equip it in Gear.`);
        } else {
          earnCoins(15);
          setMessage("All masks owned — +15 coins instead 🪙");
        }
      } else {
        const ok = grantRedemption("tour-discount");
        setMessage(ok ? "🎟️ Rare win: 15% off your next tour!" : "Tour discount already yours — +25 🪙");
        if (!ok) earnCoins(25);
      }
      setSpinning(false);
    },
    [earnCoins, masks, unlockMask, grantRedemption],
  );

  const spin = useCallback(() => {
    if (spinning) return;
    if (coins < SPIN_COST) {
      setMessage("Not enough coins — go dive!");
      return;
    }
    if (!spendCoins(SPIN_COST)) return;
    playSound("spin");
    setMessage("");
    setSpinning(true);

    const index = pickIndex();
    turns.current += 5;
    const target = turns.current * 360 - (index * 45 + 22.5);
    rotation.value = withTiming(target, { duration: 2600, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(resolve)(index);
    });
  }, [spinning, coins, spendCoins, rotation, resolve]);

  const wheelStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={close}>
      <LinearGradient colors={["#0a5c84", "#083a52", "#02141f"]} locations={[0, 0.5, 1]} style={styles.fill}>
        <View style={styles.topBar}>
          <Pressable onPress={close} style={styles.backBtn}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
          <CoinPill coins={coins} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Wheel of Tides</Text>
          <Text style={styles.subtitle}>A cheap spin of the sea. Mostly coins, sometimes a mask — and one rare tour discount.</Text>
        </View>

        <View style={styles.wheelWrap}>
          <View style={styles.pointer} />
          <Animated.View style={wheelStyle}>
            <Svg width={SIZE} height={SIZE}>
              <G>
                {SEGMENTS.map((seg, i) => (
                  <Path key={i} d={wedgePath(i)} fill={seg.color} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                ))}
                {SEGMENTS.map((seg, i) => {
                  const { x, y } = labelPos(i);
                  return (
                    <SvgText key={`t${i}`} x={x} y={y + 5} fill="#fff" fontSize={16} fontWeight="800" textAnchor="middle">
                      {seg.label}
                    </SvgText>
                  );
                })}
                <Circle cx={R} cy={R} r={22} fill="#02141f" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
              </G>
            </Svg>
          </Animated.View>
        </View>

        <Text style={styles.message}>{message}</Text>
        <View style={styles.footer}>
          <Button label={spinning ? "Spinning…" : `Spin · ${SPIN_COST}`} onPress={spin} disabled={spinning || coins < SPIN_COST} variant="primary" />
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  header: { alignItems: "center", paddingHorizontal: 30, paddingTop: 8 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "center", marginTop: 2 },
  wheelWrap: { alignItems: "center", justifyContent: "center", marginTop: 26 },
  pointer: {
    position: "absolute",
    top: -6,
    zIndex: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffd23f",
  },
  message: { minHeight: 22, textAlign: "center", fontFamily: fontLabel.extraBold, fontSize: 13, color: "#ffe58a", marginTop: 22, paddingHorizontal: 24 },
  footer: { paddingHorizontal: 40, marginTop: 10 },
});
