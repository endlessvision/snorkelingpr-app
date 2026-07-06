import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaskId } from "@snorkeling/shared";
import { CoinPill } from "@/components/CoinPill";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { playSound } from "@/lib/sound";

const COST = 12;

type Sym = "coin" | "shell" | "fish" | "star" | "wave";
const EMOJI: Record<Sym, string> = { coin: "🪙", shell: "🐚", fish: "🐠", star: "⭐", wave: "🌊" };
const ALL: Sym[] = ["coin", "shell", "fish", "star", "wave"];
// Coins won for three-of-a-kind (star pays a mask instead).
const MATCH_COINS: Record<Sym, number> = { coin: 40, shell: 15, fish: 20, wave: 12, star: 0 };

/** Decide the three symbols up front. ~20% are a winning three-of-a-kind. */
function rollTiles(): Sym[] {
  if (Math.random() < 0.2) {
    // Winning card — star (mask) is the rarest.
    const r = Math.random();
    const sym: Sym = r < 0.12 ? "star" : r < 0.4 ? "coin" : r < 0.65 ? "fish" : r < 0.85 ? "shell" : "wave";
    return [sym, sym, sym];
  }
  // Losing card — three distinct symbols.
  const pool = [...ALL].sort(() => Math.random() - 0.5).slice(0, 3);
  return pool;
}

/** Scratch-the-Sand — buy a patch, rub off the sand, match three to win. */
export function ScratchTheSand() {
  const visible = useUI((s) => s.screen === "scratchSand");
  const close = useUI((s) => s.close);

  const coins = useEconomy((s) => s.coins);
  const masks = useEconomy((s) => s.masks);
  const spendCoins = useEconomy((s) => s.spendCoins);
  const earnCoins = useEconomy((s) => s.earnCoins);
  const unlockMask = useEconomy((s) => s.unlockMask);

  const [tiles, setTiles] = useState<Sym[] | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [message, setMessage] = useState("");
  const [resolved, setResolved] = useState(false);

  const buy = useCallback(() => {
    if (coins < COST) {
      setMessage("Not enough coins — go dive!");
      return;
    }
    if (!spendCoins(COST)) return;
    playSound("coin");
    setTiles(rollTiles());
    setRevealed([false, false, false]);
    setMessage("");
    setResolved(false);
  }, [coins, spendCoins]);

  const resolve = useCallback(
    (t: Sym[]) => {
      setResolved(true);
      const win = t[0] === t[1] && t[1] === t[2];
      if (!win) {
        setMessage("No match this time — scratch another?");
        return;
      }
      playSound("win");
      if (t[0] === "star") {
        const unowned = (["explorer", "fortune", "voyager"] as MaskId[]).filter((m) => !masks[m]);
        if (unowned.length) {
          unlockMask(unowned[Math.floor(Math.random() * unowned.length)]);
          setMessage("⭐⭐⭐ Three stars — you won a diver's mask!");
        } else {
          earnCoins(30);
          setMessage("⭐⭐⭐ All masks owned — +30 coins instead 🪙");
        }
      } else {
        const reward = MATCH_COINS[t[0]];
        earnCoins(reward);
        setMessage(`Three of a kind — +${reward} coins 🪙`);
      }
    },
    [masks, unlockMask, earnCoins],
  );

  const scratch = (i: number) => {
    if (!tiles || revealed[i]) return;
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
    if (next.every(Boolean)) resolve(tiles);
  };

  const handleClose = () => {
    setTiles(null);
    setRevealed([false, false, false]);
    setMessage("");
    setResolved(false);
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={handleClose}>
      <LinearGradient colors={["#0a83ac", "#0a5c84", "#02141f"]} locations={[0, 0.45, 1]} style={styles.fill}>
        <View style={styles.topBar}>
          <Pressable onPress={handleClose} style={styles.backBtn}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
          <CoinPill coins={coins} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Scratch-the-Sand</Text>
          <Text style={styles.subtitle}>Buy a patch of seabed and rub the sand away. Uncover three of a kind to win.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tiles}>
            {[0, 1, 2].map((i) => {
              const isOpen = tiles && revealed[i];
              return (
                <Pressable key={i} onPress={() => scratch(i)} style={styles.tile} disabled={!tiles}>
                  {isOpen ? (
                    <Text style={styles.tileSym}>{EMOJI[tiles![i]]}</Text>
                  ) : (
                    <LinearGradient colors={["#e3c48f", "#c9a86a"]} style={styles.sand}>
                      <Text style={styles.sandHint}>{tiles ? "rub" : "· · ·"}</Text>
                    </LinearGradient>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.message}>{message}</Text>

        <View style={styles.footer}>
          {!tiles || resolved ? (
            <Button label={coins < COST ? `Need ${COST} coins` : `Buy a patch · ${COST}`} onPress={buy} disabled={coins < COST} variant="primary" />
          ) : (
            <Text style={styles.rubHint}>Tap all three patches to reveal them</Text>
          )}
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
  card: {
    width: 300,
    height: 150,
    alignSelf: "center",
    marginTop: 26,
    borderRadius: 20,
    backgroundColor: "rgba(10,58,74,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  tiles: { flexDirection: "row", gap: 14 },
  tile: { width: 74, height: 74, borderRadius: 16, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)" },
  sand: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  sandHint: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "rgba(90,58,6,0.6)" },
  tileSym: { fontSize: 40 },
  message: { minHeight: 22, textAlign: "center", fontFamily: fontLabel.extraBold, fontSize: 13, color: "#ffe58a", marginTop: 22, paddingHorizontal: 24 },
  footer: { paddingHorizontal: 40, marginTop: 10, alignItems: "center" },
  rubHint: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.7)" },
});
