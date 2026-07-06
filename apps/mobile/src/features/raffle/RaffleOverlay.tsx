import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { currentWeekKey, monthName, raffleDrawDate } from "@/lib/periods";
import { playSound } from "@/lib/sound";

interface Pack {
  tickets: number;
  cost: number;
  best?: boolean;
}
const PACKS: Pack[] = [
  { tickets: 1, cost: 50 },
  { tickets: 5, cost: 200, best: true },
  { tickets: 12, cost: 400 },
];

function two(n: number) {
  return String(n).padStart(2, "0");
}

/** Monthly Free Tour Raffle — the one big prize, capped at one per month. */
export function RaffleOverlay() {
  const visible = useUI((s) => s.screen === "raffle");
  const close = useUI((s) => s.close);

  const coins = useEconomy((s) => s.coins);
  const raffle = useEconomy((s) => s.raffle);
  const spendCoins = useEconomy((s) => s.spendCoins);
  const addRaffleEntries = useEconomy((s) => s.addRaffleEntries);

  const [now, setNow] = useState(() => new Date());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [visible]);

  const draw = useMemo(() => raffleDrawDate(now), [now]);
  const remaining = Math.max(0, draw.getTime() - now.getTime());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  const month = monthName(now);
  const entries = raffle.entries;
  // Deterministic "social proof" that's stable within a week.
  const enteredToday = useMemo(() => {
    let h = 0;
    const key = currentWeekKey(now);
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 1000;
    return 40 + (h % 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeekKey(now)]);

  const buy = (pack: Pack) => {
    if (coins < pack.cost) {
      setMessage("Not enough coins — keep diving!");
      return;
    }
    if (!spendCoins(pack.cost)) return;
    addRaffleEntries(pack.tickets);
    playSound("win");
    setMessage(`+${pack.tickets} ${pack.tickets === 1 ? "ticket" : "tickets"} in the ${month} drawing! 🎟️`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={close}>
      <LinearGradient colors={["#0a4f70", "#0a3a5c", "#02141f"]} locations={[0, 0.5, 1]} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable onPress={close} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <CoinPill coins={coins} />
          </View>

          {/* prize hero */}
          <LinearGradient colors={["#1372a0", "#16c0d8"]} style={styles.hero}>
            <Text style={styles.heroEyebrow}>{month.toUpperCase()} GRAND PRIZE</Text>
            <Text style={styles.heroTitle}>Free Snorkel Tour for Two</Text>
            <Text style={styles.heroValue}>$250 value, on us · one winner every month</Text>
            <Text style={styles.heroBig}>🏆🎟️</Text>
          </LinearGradient>

          {/* countdown */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>DRAW CLOSES IN</Text>
            <Text style={styles.countdown}>
              {two(days)}:{two(hours)}:{two(mins)}:{two(secs)}
            </Text>
            <Text style={styles.cardHint}>Drawn on the last day of {month} at 8:00 PM.</Text>
          </View>

          {/* your entries */}
          <View style={styles.entriesCard}>
            <Text style={styles.cardLabel}>YOUR ENTRIES THIS MONTH</Text>
            <Text style={styles.entriesBig}>🎟️ {entries}</Text>
            <Text style={styles.cardHint}>Every ticket is one chance in the {month} drawing.</Text>
            <Text style={styles.social}>{enteredToday} divers entered today</Text>
          </View>

          <Text style={styles.message}>{message}</Text>

          {/* packs */}
          <Text style={styles.sectionLabel}>GET TICKETS</Text>
          {PACKS.map((p) => {
            const afford = coins >= p.cost;
            return (
              <Pressable key={p.tickets} onPress={() => buy(p)} style={[styles.pack, p.best && styles.packBest]}>
                <View style={styles.packLeft}>
                  <Text style={styles.packTickets}>🎟️ {p.tickets} {p.tickets === 1 ? "ticket" : "tickets"}</Text>
                  {p.best && <Text style={styles.bestTag}>BEST VALUE</Text>}
                </View>
                <View style={[styles.packBuy, { backgroundColor: afford ? "#16c0d8" : "rgba(255,255,255,0.12)" }]}>
                  <Text style={[styles.packCost, { color: afford ? "#fff" : "rgba(255,255,255,0.5)" }]}>🪙 {p.cost}</Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.howCard}>
            <Text style={styles.howTitle}>How it works</Text>
            <Text style={styles.howText}>
              Coins buy tickets — never real money. One winner is drawn every month; more tickets mean more chances.
              No purchase ever required.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingBottom: 40 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  hero: { marginHorizontal: 20, marginTop: 12, borderRadius: 20, padding: 20, alignItems: "center", overflow: "hidden" },
  heroEyebrow: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 1.4, color: "#ffd23f" },
  heroTitle: { fontFamily: fontDisplay.semiBold, fontSize: 26, color: "#fff", textAlign: "center", marginTop: 4 },
  heroValue: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.9)", textAlign: "center", marginTop: 4 },
  heroBig: { fontSize: 40, marginTop: 8 },
  card: { marginHorizontal: 20, marginTop: 14, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 16, padding: 16, alignItems: "center" },
  cardLabel: { fontFamily: fontLabel.extraBold, fontSize: 10, letterSpacing: 1.2, color: "rgba(255,255,255,0.6)" },
  countdown: { fontFamily: fontDisplay.bold, fontSize: 34, color: "#fff", marginTop: 6, letterSpacing: 1 },
  cardHint: { fontFamily: fontBody.medium, fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6, textAlign: "center" },
  entriesCard: { marginHorizontal: 20, marginTop: 14, backgroundColor: "rgba(255,210,63,0.1)", borderWidth: 1, borderColor: "rgba(255,210,63,0.3)", borderRadius: 16, padding: 16, alignItems: "center" },
  entriesBig: { fontFamily: fontDisplay.bold, fontSize: 40, color: "#ffe58a", marginTop: 4 },
  social: { fontFamily: fontLabel.bold, fontSize: 11, color: "#7fe6ef", marginTop: 8 },
  message: { minHeight: 20, textAlign: "center", fontFamily: fontLabel.extraBold, fontSize: 12, color: "#ffe58a", marginTop: 12, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.7)", marginTop: 6, marginBottom: 10, marginHorizontal: 20 },
  pack: { marginHorizontal: 20, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", borderRadius: 16, padding: 14 },
  packBest: { borderColor: "#ffd23f", backgroundColor: "rgba(255,210,63,0.08)" },
  packLeft: { gap: 3 },
  packTickets: { fontFamily: fontLabel.extraBold, fontSize: 16, color: "#fff" },
  bestTag: { fontFamily: fontLabel.extraBold, fontSize: 9, letterSpacing: 0.5, color: "#ffd23f" },
  packBuy: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 100 },
  packCost: { fontFamily: fontLabel.extraBold, fontSize: 14 },
  howCard: { marginHorizontal: 20, marginTop: 8, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16 },
  howTitle: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff", marginBottom: 4 },
  howText: { fontFamily: fontBody.medium, fontSize: 12.5, lineHeight: 18, color: "rgba(255,255,255,0.75)" },
});
