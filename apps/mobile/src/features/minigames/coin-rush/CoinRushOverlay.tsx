import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { EquippedGear } from "@snorkeling/shared";
import { CoinIcon } from "@/svg/CoinIcon";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import {
  coinRushCatchBase,
  coinRushCoinMultiplier,
  coinRushDurationMs,
  coinRushFlagBonus,
  coinRushRareBoost,
  urchinsAreHarmless,
} from "@/features/gear/perks";
import { CoinRushEntity, CoinRushEntityData, EntityType } from "./CoinRushEntity";

interface Props {
  visible: boolean;
  gear: EquippedGear;
  onClose: () => void;
  onEarnCoins: (amount: number) => void;
  /** Flat XP awarded at the end of a round (Phase 6). */
  onAddXp: (amount: number) => void;
}

let nextId = 1;

const END_XP = 5;

export function CoinRushOverlay({ visible, gear, onClose, onEarnCoins, onAddXp }: Props) {
  // Perks (Sunray +5s, Reef Blue urchin immunity, Diver Down +5, Explorer/
  // Alpha rare boost, Fortune/Coral/Aqua coin math) come from the equipped gear.
  const durationMs = coinRushDurationMs(gear);
  const gearRef = useRef(gear);
  gearRef.current = gear;
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [entities, setEntities] = useState<CoinRushEntityData[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [comboPopup, setComboPopup] = useState<number | null>(null);
  const [finalCoins, setFinalCoins] = useState(0);
  const [bestMultShown, setBestMultShown] = useState(1);

  const bestComboRef = useRef(0);
  const bestMultRef = useRef(1);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const roundDurationRef = useRef(durationMs);
  const viewport = useRef({ w: 375, h: 700 });
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const comboPopupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const flashOpacity = useSharedValue(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    viewport.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
  }, []);

  const clearTimers = useCallback(() => {
    activeRef.current = false;
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (endTimer.current) clearTimeout(endTimer.current);
    if (tickTimer.current) clearInterval(tickTimer.current);
    if (comboPopupTimer.current) clearTimeout(comboPopupTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const spawnOne = useCallback(() => {
    const elapsed = Date.now() - startedAt.current;
    const prog = Math.min(1, elapsed / roundDurationRef.current);
    const { w, h } = viewport.current;

    const r = Math.random();
    let type: EntityType = "coin";
    const rareBoost = coinRushRareBoost(gearRef.current);
    if (r < 0.1 + 0.1 * prog) type = "urchin";
    else if (r < rareBoost + 0.1 * prog) type = "gem";

    const base = type === "gem" ? 150 : type === "urchin" ? 120 : 105;
    const speed = base + prog * 70 + Math.random() * 40; // px/s
    const distance = h + 90;
    const travelMs = (distance / speed) * 1000;
    const value = type === "gem" ? 5 : type === "urchin" ? 0 : 1;
    const x = 20 + Math.random() * Math.max(1, w - 60);

    setEntities((prev) => [
      ...prev,
      { id: nextId++, type, x, startY: h + 30, exitY: -70, travelMs, value },
    ]);
  }, []);

  // Single recursive scheduler — spawns 1 (occasionally 2) entities per tick,
  // then queues exactly one follow-up. Never forks a second timer chain.
  const scheduleSpawn = useCallback(() => {
    if (!activeRef.current) return;
    const elapsed = Date.now() - startedAt.current;
    const prog = Math.min(1, elapsed / roundDurationRef.current);
    spawnOne();
    if (prog > 0.5 && Math.random() < 0.4) spawnOne();

    const interval = Math.max(320, 800 - prog * 450);
    spawnTimer.current = setTimeout(scheduleSpawn, interval);
  }, [spawnOne]);

  const startGame = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    roundDurationRef.current = coinRushDurationMs(gearRef.current);
    setEntities([]);
    setScore(0);
    setCombo(0);
    scoreRef.current = 0;
    comboRef.current = 0;
    bestComboRef.current = 0;
    bestMultRef.current = 1;
    setTimeLeft(Math.round(roundDurationRef.current / 1000));
    startedAt.current = Date.now();
    setPhase("playing");

    spawnTimer.current = setTimeout(scheduleSpawn, 120);
    tickTimer.current = setInterval(() => {
      const remaining = Math.max(0, roundDurationRef.current - (Date.now() - startedAt.current));
      setTimeLeft(Math.ceil(remaining / 1000));
    }, 200);
    endTimer.current = setTimeout(() => endGame(), roundDurationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleSpawn, clearTimers]);

  const endGame = useCallback(() => {
    clearTimers();
    setEntities([]);
    const gained = scoreRef.current + coinRushFlagBonus(gearRef.current);
    setFinalCoins(gained);
    setBestMultShown(bestMultRef.current);
    onEarnCoins(gained);
    onAddXp(END_XP);
    setPhase("over");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimers, onEarnCoins, onAddXp]);

  const flash = useCallback(() => {
    flashOpacity.value = 1;
    flashOpacity.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.ease) });
  }, [flashOpacity]);

  const showCombo = useCallback((mult: number) => {
    setComboPopup(mult);
    if (comboPopupTimer.current) clearTimeout(comboPopupTimer.current);
    comboPopupTimer.current = setTimeout(() => setComboPopup(null), 500);
  }, []);

  const removeEntity = useCallback((id: number) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleCatch = useCallback(
    (data: CoinRushEntityData) => {
      removeEntity(data.id);
      if (data.type === "urchin") {
        // Reef Blue Suit makes urchins harmless (they just vanish).
        if (urchinsAreHarmless(gearRef.current)) return;
        comboRef.current = 0;
        setCombo(0);
        scoreRef.current = Math.max(0, scoreRef.current - 5);
        setScore(scoreRef.current);
        flash();
        return;
      }
      comboRef.current += 1;
      const mult = Math.min(5, 1 + Math.floor((comboRef.current - 1) / 3));
      if (comboRef.current > bestComboRef.current) bestComboRef.current = comboRef.current;
      if (mult > bestMultRef.current) bestMultRef.current = mult;
      // Aqua Fins (+1 on coins), Fortune Mask (x1.5), Coral Fins (x1.1).
      const base = coinRushCatchBase(gearRef.current, data.type, data.value);
      const gain = Math.round(base * mult * coinRushCoinMultiplier(gearRef.current));
      scoreRef.current += gain;
      setScore(scoreRef.current);
      setCombo(comboRef.current);
      if (comboRef.current >= 2) showCombo(mult);
    },
    [removeEntity, flash, showCombo],
  );

  const handleMiss = useCallback(
    (data: CoinRushEntityData) => {
      removeEntity(data.id);
      if (data.type !== "urchin") {
        comboRef.current = 0;
        setCombo(0);
      }
    },
    [removeEntity],
  );

  useEffect(() => {
    if (visible && phase !== "playing") {
      setPhase("ready");
    }
    if (!visible) {
      clearTimers();
      setEntities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay} onLayout={onLayout}>
      <View style={styles.playfield}>
        {entities.map((e) => (
          <CoinRushEntity key={e.id} data={e} onCatch={handleCatch} onMiss={handleMiss} />
        ))}
      </View>

      <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />

      {phase === "playing" && (
        <View style={styles.hud} pointerEvents="box-none">
          <View style={styles.hudRow}>
            <View style={styles.scorePill}>
              <CoinIcon size={20} />
              <Text style={styles.scoreText}>{score}</Text>
            </View>
            <View style={styles.timerPill}>
              <Text style={styles.timerText}>⏱ {timeLeft}</Text>
            </View>
          </View>
          {comboPopup !== null && (
            <Text style={styles.comboPopup}>Combo ×{comboPopup}</Text>
          )}
        </View>
      )}

      {phase === "ready" && (
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>🪙</Text>
          <Text style={styles.title}>Coin Rush</Text>
          <Text variant="body" color="rgba(255,255,255,0.85)" style={styles.desc}>
            Tap the rising coin bubbles before they reach the surface. Chain catches for a bigger
            combo — but dodge the spiky urchins!
          </Text>
          <Button label="Start diving ⚡" onPress={startGame} />
          <Pressable onPress={onClose} style={styles.notNow}>
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>
        </View>
      )}

      {phase === "over" && (
        <View style={styles.center}>
          <Text style={styles.eyebrow}>TIME&apos;S UP</Text>
          <Text style={styles.title}>Nice haul!</Text>
          <View style={styles.resultPill}>
            <CoinIcon size={34} />
            <Text style={styles.resultValue}>{finalCoins}</Text>
            <Text style={styles.resultLabel}>coins</Text>
          </View>
          <Text variant="body" color="rgba(255,255,255,0.8)" style={styles.desc}>
            Best combo ×{bestMultShown} · added to your balance
          </Text>
          <View style={styles.rowButtons}>
            <Button label="Play again" onPress={startGame} variant="glass" />
            <Button label="Done" onPress={onClose} variant="light" />
          </View>
        </View>
      )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0a5c84",
    overflow: "hidden",
  },
  playfield: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  flash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,60,60,0.4)",
  },
  hud: { position: "absolute", top: 52, left: 16, right: 16 },
  hudRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(3,30,44,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 100,
  },
  scoreText: { fontFamily: fontDisplay.bold, fontSize: 16, color: "#fff" },
  timerPill: { backgroundColor: "rgba(255,46,147,0.92)", paddingVertical: 7, paddingHorizontal: 15, borderRadius: 100 },
  timerText: { fontFamily: fontDisplay.bold, fontSize: 15, color: "#fff" },
  comboPopup: {
    textAlign: "center",
    marginTop: 12,
    fontFamily: fontDisplay.bold,
    fontSize: 16,
    color: "#ffe58a",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 },
  bigEmoji: { fontSize: 54, marginBottom: 4 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  desc: { textAlign: "center", marginBottom: 12 },
  notNow: { marginTop: 14 },
  notNowText: { fontFamily: fontLabel.bold, fontSize: 13, color: "rgba(255,255,255,0.8)" },
  eyebrow: { fontFamily: fontLabel.bold, fontSize: 12, letterSpacing: 2, color: "#7fe6ef" },
  resultPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 20,
    marginVertical: 8,
  },
  resultValue: { fontFamily: fontDisplay.semiBold, fontSize: 40, color: "#ffe58a" },
  resultLabel: { fontFamily: fontLabel.bold, fontSize: 13, color: "rgba(255,255,255,0.8)", alignSelf: "flex-end", marginBottom: 6 },
  rowButtons: { flexDirection: "row", gap: 10, marginTop: 16 },
});
