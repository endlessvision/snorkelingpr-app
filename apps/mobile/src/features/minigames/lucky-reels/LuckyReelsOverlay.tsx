import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MaskId, OwnedMasks } from "@snorkeling/shared";
import { CoinIcon } from "@/svg/CoinIcon";
import { GemIcon } from "@/svg/GemIcon";
import { MaskIcon } from "@/svg/MaskIcon";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { CoinPill } from "@/components/CoinPill";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { gearColor } from "@/theme/tokens";
import { useEconomy } from "@/store/useEconomy";
import { playSound } from "@/lib/sound";

type ReelSymbol = "coin" | "fish" | "explorer" | "fortune" | "voyager";

interface Outcome {
  kind: "mask" | "jackpot" | "pair" | "none";
  results: [ReelSymbol, ReelSymbol, ReelSymbol];
  mask?: MaskId;
  reward: number;
}

const SPIN_COST = 15;
const STOP_TIMES = [800, 1200, 1650];
const MASK_DEFS: { id: MaskId; name: string; perk: string }[] = [
  { id: "explorer", name: "Explorer Mask", perk: "Higher chance of finding rare fish" },
  { id: "fortune", name: "Fortune Mask", perk: "More coins per bubble you pop" },
  { id: "voyager", name: "Voyager Mask", perk: "Better discounts in the Treasure Shop" },
];
const ALL_SYMBOLS: ReelSymbol[] = ["coin", "fish", "explorer", "fortune", "voyager"];

function randomSymbol(): ReelSymbol {
  return ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
}

function decideOutcome(masks: OwnedMasks): Outcome {
  const unowned = (["explorer", "fortune", "voyager"] as MaskId[]).filter((m) => !masks[m]);
  if (unowned.length && Math.random() < 0.3) {
    const mask = unowned[Math.floor(Math.random() * unowned.length)];
    return { kind: "mask", results: [mask, mask, mask], mask, reward: 0 };
  }
  const r = Math.random();
  if (r < 0.14) return { kind: "jackpot", results: ["coin", "coin", "coin"], reward: 40 };
  if (r < 0.34) {
    const shuffled = (["coin", "coin", "fish"] as ReelSymbol[]).sort(() => Math.random() - 0.5);
    return { kind: "pair", results: shuffled as [ReelSymbol, ReelSymbol, ReelSymbol], reward: 8 };
  }
  let a = randomSymbol();
  let b = randomSymbol();
  while (b === a) b = randomSymbol();
  let c = randomSymbol();
  while (c === a || c === b) c = randomSymbol();
  return { kind: "none", results: [a, b, c], reward: 0 };
}

function ReelSymbolView({ symbol }: { symbol: ReelSymbol }) {
  if (symbol === "coin") return <CoinIcon size={48} />;
  if (symbol === "fish") return <GemIcon size={48} />;
  const color = gearColor.mask[symbol];
  return <MaskIcon size={54} color={color} />;
}

interface Props {
  visible: boolean;
  coins: number;
  ownedMasks: OwnedMasks;
  onClose: () => void;
  onSpendCoins: (amount: number) => boolean;
  onEarnCoins: (amount: number) => void;
  onUnlockMask: (id: MaskId) => void;
}

/** Reached from the Redeem sheet — ports the Lucky Reels slot machine. */
export function LuckyReelsOverlay({
  visible,
  coins,
  ownedMasks,
  onClose,
  onSpendCoins,
  onEarnCoins,
  onUnlockMask,
}: Props) {
  const freeSpins = useEconomy((s) => s.freeSpins);
  const consumeFreeSpin = useEconomy((s) => s.consumeFreeSpin);

  const [reels, setReels] = useState<[ReelSymbol, ReelSymbol, ReelSymbol]>(["coin", "fish", "coin"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const cycleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAll = useCallback(() => {
    if (cycleTimer.current) clearInterval(cycleTimer.current);
  }, []);

  useEffect(() => stopAll, [stopAll]);
  useEffect(() => {
    if (!visible) stopAll();
  }, [visible, stopAll]);

  const spin = useCallback(() => {
    if (spinning) return;
    // A queued free spin (from the daily streak) is used before charging coins.
    const useFree = freeSpins > 0;
    if (useFree) {
      consumeFreeSpin();
    } else if (coins < SPIN_COST) {
      setMessage("Not enough coins — go dive!");
      return;
    } else if (!onSpendCoins(SPIN_COST)) {
      return;
    }

    playSound("spin");
    const outcome = decideOutcome(ownedMasks);
    setSpinning(true);
    setMessage("");
    const start = Date.now();
    const stops = STOP_TIMES.map((t) => start + t);

    stopAll();
    cycleTimer.current = setInterval(() => {
      const now = Date.now();
      setReels((prev) => {
        const next: [ReelSymbol, ReelSymbol, ReelSymbol] = [...prev] as [ReelSymbol, ReelSymbol, ReelSymbol];
        let allStopped = true;
        for (let i = 0; i < 3; i++) {
          if (now < stops[i]) {
            allStopped = false;
            next[i] = randomSymbol();
          } else {
            next[i] = outcome.results[i];
          }
        }
        if (allStopped) {
          stopAll();
          setSpinning(false);
          if (outcome.kind === "mask" && outcome.mask) {
            onUnlockMask(outcome.mask);
            setMessage(`🎉 You won the ${MASK_DEFS.find((m) => m.id === outcome.mask)?.name}!`);
          } else if (outcome.kind === "jackpot") {
            onEarnCoins(outcome.reward);
            setMessage(`💰 Jackpot! +${outcome.reward} coins`);
          } else if (outcome.kind === "pair") {
            onEarnCoins(outcome.reward);
            setMessage(`Two of a kind · +${outcome.reward} coins`);
          } else {
            setMessage("So close — spin again!");
          }
        }
        return next;
      });
    }, 80);
  }, [spinning, coins, freeSpins, consumeFreeSpin, onSpendCoins, ownedMasks, stopAll, onEarnCoins, onUnlockMask]);

  const canSpin = !spinning && (freeSpins > 0 || coins >= SPIN_COST);
  const spinLabel = spinning ? "Spinning…" : freeSpins > 0 ? "Free spin 🎁" : `Spin · ${SPIN_COST}`;

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
        <Text style={styles.title}>Lucky Reels</Text>
        <Text variant="body" color="rgba(255,255,255,0.82)" style={styles.subtitle}>
          Match three masks to win one — each mask gives you an edge underwater.
        </Text>
      </View>

      <View style={styles.machine}>
        <View style={styles.reelsRow}>
          {reels.map((sym, i) => (
            <View key={i} style={styles.reelCell}>
              <ReelSymbolView symbol={sym} />
            </View>
          ))}
        </View>
        <Text style={styles.message}>{message}</Text>
        <Button label={spinLabel} onPress={spin} disabled={!canSpin} variant="primary" />
      </View>

      <View style={styles.maskList}>
        <Text style={styles.maskListLabel}>YOUR MASKS</Text>
        {MASK_DEFS.map((m) => {
          const owned = ownedMasks[m.id];
          return (
            <View
              key={m.id}
              style={[styles.maskCard, { borderColor: owned ? gearColor.mask[m.id] : "rgba(255,255,255,0.16)" }]}
            >
              <View style={styles.maskIconWrap}>
                <MaskIcon size={42} color={gearColor.mask[m.id]} />
              </View>
              <View style={styles.maskText}>
                <Text style={styles.maskName}>{m.name}</Text>
                <Text style={styles.maskPerk}>{m.perk}</Text>
              </View>
              <Text style={[styles.maskStatus, { color: owned ? "#7fffd0" : "rgba(255,255,255,0.45)" }]}>
                {owned ? "✓ OWNED" : "LOCKED"}
              </Text>
            </View>
          );
        })}
      </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0a4f70",
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
  header: { alignItems: "center", paddingHorizontal: 24, marginTop: 10 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { textAlign: "center", marginTop: 4, maxWidth: 270 },
  machine: {
    margin: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    padding: 18,
  },
  reelsRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
  reelCell: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#e9f6f8",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    minHeight: 22,
    textAlign: "center",
    marginVertical: 12,
    fontFamily: fontLabel.extraBold,
    fontSize: 14,
    color: "#ffe58a",
  },
  maskList: { paddingHorizontal: 20, paddingBottom: 34 },
  maskListLabel: {
    fontFamily: fontLabel.extraBold,
    fontSize: 12,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  maskCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  maskIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  maskText: { flex: 1 },
  maskName: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  maskPerk: { fontFamily: fontLabel.regular, fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  maskStatus: { fontFamily: fontLabel.extraBold, fontSize: 11 },
});
