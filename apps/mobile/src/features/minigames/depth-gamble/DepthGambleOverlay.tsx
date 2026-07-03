import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { DEPTH_GAMBLE_LEVELS, depthZoneForFt } from "@snorkeling/shared";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { CoinPill } from "@/components/CoinPill";
import { fontDisplay, fontLabel } from "@/theme/fonts";

type Stage = "bet" | "diving" | "bust" | "cashed";
const BET_OPTIONS = [10, 25, 50];
const SUSPENSE_MS = 1200;

interface Props {
  visible: boolean;
  coins: number;
  onClose: () => void;
  onSpendCoins: (amount: number) => boolean;
  onEarnCoins: (amount: number) => void;
}

/** Reached from the Redeem sheet — ports the Depth Gamble double-or-nothing descent. */
export function DepthGambleOverlay({ visible, coins, onClose, onSpendCoins, onEarnCoins }: Props) {
  const [stage, setStage] = useState<Stage>("bet");
  const [bet, setBet] = useState(25);
  const [level, setLevel] = useState(0);
  const [pot, setPot] = useState(0);
  const [resolving, setResolving] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(0);

  const shake = useSharedValue(0);
  const warnGlow = useSharedValue(0);
  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible && resolveTimer.current) clearTimeout(resolveTimer.current);
  }, [visible]);
  useEffect(() => () => {
    if (resolveTimer.current) clearTimeout(resolveTimer.current);
  }, []);

  const cur = DEPTH_GAMBLE_LEVELS[level];
  const hasNext = level < DEPTH_GAMBLE_LEVELS.length - 1;
  const next = hasNext ? DEPTH_GAMBLE_LEVELS[level + 1] : null;

  const startDive = useCallback(() => {
    if (coins < bet) {
      setMessage("Not enough coins for that stake");
      return;
    }
    if (!onSpendCoins(bet)) return;
    setPot(bet);
    setLevel(0);
    setMessage("");
    setStage("diving");
  }, [coins, bet, onSpendCoins]);

  const descend = useCallback(() => {
    if (resolving || !next) return;
    const bust = Math.random() < next.risk;
    setResolving(true);
    setMessage("");
    shake.value = withRepeat(withSequence(withTiming(-6, { duration: 90 }), withTiming(6, { duration: 90 })), 6, true);
    warnGlow.value = withTiming(1, { duration: 200 });

    resolveTimer.current = setTimeout(() => {
      shake.value = 0;
      if (bust) {
        setStage("bust");
        setPot(0);
        setResolving(false);
        warnGlow.value = 0;
      } else {
        setLevel((l) => l + 1);
        setPot(Math.round(bet * next.mult));
        const isLast = level + 1 >= DEPTH_GAMBLE_LEVELS.length - 1;
        setMessage(isLast ? "Deepest point — cash out now!" : "");
        setResolving(false);
        warnGlow.value = 0;
      }
    }, SUSPENSE_MS);
  }, [resolving, next, bet, level, shake, warnGlow]);

  const cashOut = useCallback(() => {
    if (resolving) return;
    onEarnCoins(pot);
    setResult(pot);
    setStage("cashed");
  }, [resolving, pot, onEarnCoins]);

  const playAgain = useCallback(() => {
    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    setResolving(false);
    setStage("bet");
    setLevel(0);
    setPot(0);
    setMessage("");
  }, []);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const warnStyle = useAnimatedStyle(() => ({ opacity: warnGlow.value }));

  const diverTopPct = (level / (DEPTH_GAMBLE_LEVELS.length - 1)) * 100;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <ScrollView style={styles.overlay} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topBar}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
        <CoinPill coins={coins} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Depth Gamble</Text>
        <Text variant="body" color="rgba(255,255,255,0.82)" style={styles.subtitle}>
          Bet coins and dive. Each level down multiplies your pot — but the deeper you go, the
          likelier the current sweeps it. Cash out before it does.
        </Text>
      </View>

      {stage === "bet" && (
        <View style={styles.panel}>
          <Text style={styles.panelLabel}>CHOOSE YOUR STAKE</Text>
          <View style={styles.betRow}>
            {BET_OPTIONS.map((v) => (
              <Pressable
                key={v}
                onPress={() => setBet(v)}
                style={[styles.betOption, bet === v && styles.betOptionActive]}
              >
                <Text style={[styles.betLabel, bet === v && styles.betLabelActive]}>
                  🪙 {v}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.message}>{message}</Text>
          <Button label="Start the descent 🤿" onPress={startDive} disabled={coins < bet} />
        </View>
      )}

      {stage === "diving" && (
        <Animated.View style={[styles.panel, shakeStyle]}>
          <View style={styles.diveRow}>
            <View style={styles.tube}>
              <LinearGradient colors={["#67dbe8", "#0ea3c6", "#0a6389", "#04283c"]} style={styles.tubeFill} />
              <Animated.View style={[styles.tubeWarn, warnStyle]} />
              <View style={[styles.diver, { top: `${diverTopPct}%` }]}>
                <Text style={styles.diverEmoji}>🤿</Text>
              </View>
            </View>
            <View style={styles.diveInfo}>
              <Text style={styles.infoLabel}>CURRENT DEPTH</Text>
              <Text style={styles.infoValue}>
                {cur.ft} ft · {depthZoneForFt(cur.ft)}
              </Text>
              <View style={styles.potCard}>
                <Text style={styles.infoLabel}>YOUR POT</Text>
                <View style={styles.potRow}>
                  <Text style={styles.potValue}>🪙 {pot}</Text>
                  <View style={styles.multPill}>
                    <Text style={styles.multText}>{level === 0 ? "at stake" : `×${cur.mult}`}</Text>
                  </View>
                </View>
              </View>
              {next && (
                <Text variant="body" color="rgba(255,255,255,0.8)" style={styles.nextText}>
                  Next · {next.ft} ft · ×{next.mult}
                </Text>
              )}
            </View>
          </View>

          {next && (
            <View style={styles.riskBlock}>
              <View style={styles.riskRow}>
                <Text style={styles.riskLabel}>RISK OF NEXT DESCENT</Text>
                <Text style={styles.riskPct}>{Math.round(next.risk * 100)}%</Text>
              </View>
              <View style={styles.riskTrack}>
                <View style={[styles.riskFill, { width: `${Math.round(next.risk * 100)}%` }]} />
              </View>
            </View>
          )}

          <Text style={styles.message}>{message}</Text>

          <Button
            label={resolving ? "Descending…" : hasNext ? `Descend deeper · win ${next ? Math.round(bet * next.mult) : 0}` : "Deepest point"}
            onPress={descend}
            disabled={resolving || !hasNext}
          />
          <Button label={`Cash out · 🪙 ${pot}`} onPress={cashOut} variant="success" style={styles.cashOutBtn} />
        </Animated.View>
      )}

      {stage === "bust" && (
        <View style={styles.resultCenter}>
          <Text style={styles.bigEmoji}>🦈</Text>
          <Text style={styles.eyebrow}>SWEPT AWAY</Text>
          <Text style={styles.title}>The deep took your pouch</Text>
          <Text variant="body" color="rgba(255,255,255,0.8)" style={styles.subtitle}>
            You lost your {bet}-coin stake. Fortune favors the bold — try again?
          </Text>
          <View style={styles.rowButtons}>
            <Button label="Try again" onPress={playAgain} />
            <Button label="Done" onPress={onClose} variant="glass" />
          </View>
        </View>
      )}

      {stage === "cashed" && (
        <View style={styles.resultCenter}>
          <Text style={styles.bigEmoji}>🎉</Text>
          <Text style={[styles.eyebrow, { color: "#7fe6ef" }]}>SURFACED SAFELY</Text>
          <Text style={styles.title}>You banked your haul!</Text>
          <View style={styles.resultPill}>
            <Text style={styles.resultValue}>+{result} 🪙</Text>
          </View>
          <View style={styles.rowButtons}>
            <Button label="Dive again" onPress={playAgain} />
            <Button label="Done" onPress={onClose} variant="glass" />
          </View>
        </View>
      )}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0a6383",
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  header: { alignItems: "center", paddingHorizontal: 24, marginTop: 8 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 26, color: "#fff", textAlign: "center" },
  subtitle: { textAlign: "center", marginTop: 4, maxWidth: 300 },
  panel: { padding: 22 },
  panelLabel: {
    fontFamily: fontLabel.extraBold,
    fontSize: 12,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  betRow: { flexDirection: "row", gap: 10 },
  betOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  betOptionActive: { backgroundColor: "#16c0d8" },
  betLabel: { fontFamily: fontDisplay.bold, fontSize: 16, color: "rgba(255,255,255,0.8)" },
  betLabelActive: { color: "#04222f" },
  message: {
    minHeight: 18,
    textAlign: "center",
    fontFamily: fontLabel.extraBold,
    fontSize: 13,
    color: "#ffd23f",
    marginVertical: 12,
  },
  diveRow: { flexDirection: "row", gap: 16, alignItems: "stretch" },
  tube: {
    width: 74,
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tubeFill: { flex: 1 },
  tubeWarn: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "34%",
    backgroundColor: "rgba(255,60,60,0.35)",
  },
  diver: { position: "absolute", left: "50%", marginLeft: -13, marginTop: -13 },
  diverEmoji: { fontSize: 26 },
  diveInfo: { flex: 1, minWidth: 0 },
  infoLabel: {
    fontFamily: fontLabel.extraBold,
    fontSize: 10,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.6)",
  },
  infoValue: { fontFamily: fontDisplay.semiBold, fontSize: 20, color: "#fff", marginBottom: 12 },
  potCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  potRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 },
  potValue: { fontFamily: fontDisplay.semiBold, fontSize: 26, color: "#ffe58a" },
  multPill: {
    backgroundColor: "rgba(127,230,239,0.14)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  multText: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#7fe6ef" },
  nextText: {},
  riskBlock: { marginTop: 14 },
  riskRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  riskLabel: { fontFamily: fontLabel.extraBold, fontSize: 9, letterSpacing: 1, color: "rgba(255,255,255,0.5)" },
  riskPct: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#ff8a8a" },
  riskTrack: { height: 7, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  riskFill: { height: "100%", backgroundColor: "#ff5b5b", borderRadius: 100 },
  cashOutBtn: { marginTop: 10 },
  resultCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 },
  bigEmoji: { fontSize: 52 },
  eyebrow: { fontFamily: fontLabel.bold, fontSize: 12, letterSpacing: 2, color: "#ff9a9a" },
  resultPill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginVertical: 8,
  },
  resultValue: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#ffe58a" },
  rowButtons: { flexDirection: "row", gap: 10, marginTop: 20 },
});
