import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIVE_SITES, DiveSite, SIGHTING_REWARDS, Species } from "@snorkeling/shared";
import { CoinIcon } from "@/svg/CoinIcon";
import { CoinPill } from "@/components/CoinPill";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { MarineCreature } from "@/svg/MarineCreature";
import { Bubble } from "@/components/Bubble";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { SPECIES, SpeciesEntry } from "@/features/collection/species";
import { playSound } from "@/lib/sound";

const RARITY_COLOR: Record<Species["rarity"], string> = {
  common: "#9fd8e0",
  uncommon: "#ffd23f",
  rare: "#ff5bb0",
};

interface LogResult {
  species: SpeciesEntry;
  site: DiveSite;
  reward: number;
}

/** Log a sighting — the core collect loop. Pick a site + species, unlock with a
 *  rarity reward (coins + XP). Replaces the old auto-unlock flow. */
export function LogSightingOverlay() {
  const visible = useUI((s) => s.screen === "logSighting");
  const close = useUI((s) => s.close);

  const coins = useEconomy((s) => s.coins);
  const loggedIds = useEconomy((s) => s.unlockedSpeciesIds);
  const unlockSpecies = useEconomy((s) => s.unlockSpecies);
  const earnCoins = useEconomy((s) => s.earnCoins);
  const addXp = useEconomy((s) => s.addXp);

  const [site, setSite] = useState<DiveSite>("Icacos");
  const [result, setResult] = useState<LogResult | null>(null);
  const [note, setNote] = useState("");

  const loggedSet = useMemo(() => new Set(loggedIds), [loggedIds]);
  const speciesHere = useMemo(() => SPECIES.filter((s) => s.foundAt.includes(site)), [site]);

  const onPickSpecies = (sp: SpeciesEntry) => {
    if (loggedSet.has(sp.id)) {
      setNote(`${sp.commonName} is already in your collection`);
      return;
    }
    const reward = SIGHTING_REWARDS[sp.rarity];
    unlockSpecies(sp.id);
    earnCoins(reward);
    addXp(reward);
    playSound("win");
    setNote("");
    setResult({ species: sp, site, reward });
  };

  const logAnother = () => setResult(null);
  const handleClose = () => {
    setResult(null);
    setNote("");
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

        {result ? (
          <View style={styles.doneWrap}>
            <Bubble left="24%" top="70%" size={9} rise={180} durationMs={4600} />
            <Bubble left="68%" top="66%" size={7} rise={180} durationMs={5200} delayMs={700} />
            <Text style={styles.doneEyebrow}>NEW SPECIES UNLOCKED</Text>
            <View style={styles.doneRing}>
              <MarineCreature kind={result.species.creature} size={100} />
            </View>
            <Text style={styles.doneName}>{result.species.commonName}</Text>
            <Text style={[styles.doneRarity, { color: RARITY_COLOR[result.species.rarity] }]}>
              {result.species.rarity.toUpperCase()} · {result.site}
            </Text>
            <View style={styles.rewardPill}>
              <CoinIcon size={24} />
              <Text style={styles.rewardValue}>+{result.reward}</Text>
              <Text style={styles.rewardXp}>+{result.reward} XP</Text>
            </View>
            <View style={styles.doneButtons}>
              <Button label="Log another" onPress={logAnother} />
              <Button label="Done" onPress={handleClose} variant="glass" />
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.pickContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Log a sighting</Text>
            <Text style={styles.subtitle}>
              What did you spot on this dive? Tap it to add it to your collection.
            </Text>

            <Text style={styles.sectionLabel}>DIVE SITE</Text>
            <View style={styles.siteRow}>
              {DIVE_SITES.map((s) => {
                const active = s === site;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSite(s)}
                    style={[styles.siteChip, { backgroundColor: active ? "#16c0d8" : "rgba(255,255,255,0.08)" }]}
                  >
                    <Text style={[styles.siteChipText, { color: active ? "#04222f" : "rgba(255,255,255,0.85)" }]}>
                      📍 {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {!!note && <Text style={styles.note}>{note}</Text>}

            <Text style={styles.sectionLabel}>MARINE LIFE</Text>
            <View style={styles.grid}>
              {speciesHere.map((sp) => {
                const logged = loggedSet.has(sp.id);
                return (
                  <Pressable
                    key={sp.id}
                    onPress={() => onPickSpecies(sp)}
                    style={[styles.speciesTile, { borderColor: logged ? "#7fffd0" : "rgba(255,255,255,0.16)" }]}
                  >
                    <MarineCreature kind={sp.creature} size={40} color={logged ? "rgba(255,255,255,0.45)" : "#dff6fb"} />
                    <Text style={styles.speciesName} numberOfLines={2}>
                      {sp.commonName}
                    </Text>
                    <Text style={[styles.speciesRarity, { color: RARITY_COLOR[sp.rarity] }]}>
                      {sp.rarity.toUpperCase()}
                    </Text>
                    {logged && <Text style={styles.check}>✅</Text>}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  pickContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 40 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 28, color: "#fff" },
  subtitle: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 2 },
  sectionLabel: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.7)", marginTop: 18, marginBottom: 10 },
  siteRow: { flexDirection: "row", gap: 8 },
  siteChip: { flex: 1, paddingVertical: 11, borderRadius: 100, alignItems: "center" },
  siteChipText: { fontFamily: fontLabel.extraBold, fontSize: 12 },
  note: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#ffd23f", marginTop: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  speciesTile: {
    width: "31.5%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginBottom: 10,
    alignItems: "center",
    gap: 5,
  },
  speciesName: { fontFamily: fontLabel.extraBold, fontSize: 10, color: "#fff", textAlign: "center", lineHeight: 12 },
  speciesRarity: { fontFamily: fontLabel.extraBold, fontSize: 8, letterSpacing: 0.5 },
  check: { position: "absolute", top: 6, right: 6, fontSize: 12 },
  doneWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  doneEyebrow: { fontFamily: fontLabel.bold, fontSize: 12, letterSpacing: 1.6, color: "#7fe6ef" },
  doneRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  doneName: { fontFamily: fontDisplay.semiBold, fontSize: 28, color: "#fff", textAlign: "center" },
  doneRarity: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 1, marginTop: 2 },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  rewardValue: { fontFamily: fontDisplay.semiBold, fontSize: 28, color: "#ffe58a" },
  rewardXp: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#7fe6ef", alignSelf: "flex-end", marginBottom: 6 },
  doneButtons: { flexDirection: "row", gap: 10, marginTop: 24 },
});
