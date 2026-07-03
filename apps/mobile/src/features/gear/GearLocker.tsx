import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { GEAR_DEFS, GearCategory, MaskId } from "@snorkeling/shared";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { DiverAvatar } from "./DiverAvatar";

const TABS: { key: GearCategory; label: string }[] = [
  { key: "mask", label: "Mask" },
  { key: "fins", label: "Fins" },
  { key: "suit", label: "Wetsuit" },
  { key: "flag", label: "Flag" },
];

const MASK_NAMES: Record<MaskId, string> = {
  explorer: "Explorer",
  fortune: "Fortune",
  voyager: "Voyager",
};

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** The Gear locker overlay — ports the Dive Locker from Snorkeling Dive.dc.html. */
export function GearLocker({ visible, onClose }: Props) {
  const coins = useEconomy((s) => s.coins);
  const gear = useEconomy((s) => s.gear);
  const masks = useEconomy((s) => s.masks);
  const toggleGear = useEconomy((s) => s.toggleGear);

  const [tab, setTab] = useState<GearCategory>("fins");
  const [message, setMessage] = useState("");

  const options = GEAR_DEFS[tab];

  const onOptionPress = (id: string) => {
    if (tab === "mask" && !masks[id as MaskId]) {
      setMessage(`Win the ${MASK_NAMES[id as MaskId]} Mask in Lucky Reels first`);
      return;
    }
    setMessage("");
    toggleGear(tab, id as never);
  };

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
          <Text style={styles.title}>Dive Locker</Text>
          <Text variant="body" color="rgba(255,255,255,0.82)" style={styles.subtitle}>
            Equip gear for perks — all of it is optional.
          </Text>
        </View>

        <View style={styles.avatarWrap}>
          <DiverAvatar gear={gear} />
        </View>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => {
                  setTab(t.key);
                  setMessage("");
                }}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.options}>
          {options.map((o) => {
            const equipped = gear[tab] === o.id;
            const locked = tab === "mask" && !masks[o.id as MaskId];
            return (
              <Pressable
                key={o.id}
                onPress={() => onOptionPress(o.id)}
                style={[styles.option, { borderColor: equipped ? o.color : "rgba(255,255,255,0.14)" }]}
              >
                <View style={[styles.swatch, { backgroundColor: o.color }]} />
                <View style={styles.optionText}>
                  <Text style={styles.optionName}>{o.name}</Text>
                  <Text style={styles.optionPerk}>{o.perk}</Text>
                </View>
                {equipped ? (
                  <Text style={styles.equipped}>✓ EQUIPPED</Text>
                ) : locked ? (
                  <Text style={styles.locked}>🔒 LOCKED</Text>
                ) : (
                  <Text style={styles.equip}>Equip</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#0a5f83" },
  scrollContent: { flexGrow: 1, paddingBottom: 34 },
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
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { textAlign: "center", marginTop: 2 },
  avatarWrap: { alignItems: "center", marginTop: 10 },
  message: {
    minHeight: 18,
    textAlign: "center",
    fontFamily: fontLabel.extraBold,
    fontSize: 12,
    color: "#ffd23f",
    paddingHorizontal: 24,
  },
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 20, marginTop: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#16c0d8" },
  tabLabel: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "rgba(255,255,255,0.75)" },
  tabLabelActive: { color: "#04222f" },
  options: { paddingHorizontal: 20, paddingTop: 14 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  swatch: { width: 40, height: 40, borderRadius: 11 },
  optionText: { flex: 1 },
  optionName: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  optionPerk: { fontFamily: fontLabel.regular, fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  equipped: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#7fffd0" },
  locked: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "rgba(255,255,255,0.45)" },
  equip: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#bfefff" },
});
