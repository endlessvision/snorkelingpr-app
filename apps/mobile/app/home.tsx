import { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { CoinPill } from "@/components/CoinPill";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";

type BoatId = "medusa" | "kraken";

const BOATS: Record<BoatId, { name: string; captain: string; greet: string; popular?: boolean; img: ReturnType<typeof require> }> = {
  medusa: {
    name: "Medusa",
    captain: "Yeu",
    greet: "¡Hola! Welcome aboard the Medusa 🪼",
    popular: true,
    img: require("../assets/boat-medusa.png"),
  },
  kraken: {
    name: "El Kraken",
    captain: "Danty",
    greet: "¡Hola! Welcome aboard El Kraken 🐙",
    img: require("../assets/boat-kraken.png"),
  },
};

function BobbingBoat({ id, selected, onPress }: { id: BoatId; selected: boolean; onPress: () => void }) {
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [bob]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: -bob.value * 8 }] }));
  const boat = BOATS[id];

  return (
    <Pressable style={styles.boatCol} onPress={onPress}>
      <Animated.View style={[styles.boatRing, selected && styles.boatRingActive, style]}>
        <Image source={boat.img} style={styles.boatImg} resizeMode="contain" />
      </Animated.View>
      <View style={styles.boatLabelRow}>
        <Text style={[styles.boatName, selected && styles.boatNameActive]}>{boat.name}</Text>
        {boat.popular && (
          <View style={styles.popularTag}>
            <Text style={styles.popularText}>★ POPULAR</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/** Boat-select "above water" home shown after onboarding — pick a boat, meet the
 *  captain, then set sail into the Dive. */
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const coins = useEconomy((s) => s.coins);

  const [selected, setSelected] = useState<BoatId>("medusa");
  const [captainOpen, setCaptainOpen] = useState(false);
  const boat = BOATS[selected];

  const setSail = () => router.replace("/(tabs)");

  return (
    <LinearGradient colors={["#bdeaff", "#7fd6f0", "#16c0d8", "#0a8fb6"]} locations={[0, 0.35, 0.7, 1]} style={styles.fill}>
      {/* sun + sparkles */}
      <View style={styles.sun} />
      <Text style={[styles.gull, { top: insets.top + 30, left: 60 }]}>𓅪</Text>
      <Text style={[styles.gull, { top: insets.top + 54, left: 120 }]}>𓅪</Text>

      <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetSmall}>Good morning,</Text>
            <Text style={styles.greetName}>Maya 🌊</Text>
          </View>
          <View style={styles.headerRight}>
            <CoinPill coins={coins} variant="dark" />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
          </View>
        </View>

        <Text style={styles.chooseTitle}>Choose your boat</Text>
        <Text style={styles.chooseSub}>Both run Icacos &amp; Vieques tours — tap to meet the captain.</Text>

        <View style={styles.boats}>
          <BobbingBoat id="medusa" selected={selected === "medusa"} onPress={() => setSelected("medusa")} />
          <BobbingBoat id="kraken" selected={selected === "kraken"} onPress={() => setSelected("kraken")} />
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => setCaptainOpen(true)} style={styles.meetBtn}>
            <Text style={styles.meetText}>Meet Captain {boat.captain} 🧑‍✈️</Text>
          </Pressable>
          <Button label={`Set sail on ${boat.name} 🤿`} onPress={setSail} variant="primary" />
        </View>
      </View>

      {/* captain view */}
      <Modal visible={captainOpen} animationType="slide" transparent statusBarTranslucent onRequestClose={() => setCaptainOpen(false)}>
        <LinearGradient colors={["#0a4f70", "#0a3a5c"]} style={styles.fill}>
          <View style={[styles.captainWrap, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
            <Pressable onPress={() => setCaptainOpen(false)} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <View style={styles.wheel}>
              <Text style={{ fontSize: 100 }}>🧑‍✈️</Text>
            </View>
            <Text style={styles.captainEyebrow}>YOUR CAPTAIN · {boat.name.toUpperCase()}</Text>
            <Text style={styles.captainName}>Captain {boat.captain}</Text>
            <Text style={styles.captainGreet}>{boat.greet}</Text>
            <View style={styles.captainCta}>
              <Button label={`Set sail with ${boat.captain} 🤿`} onPress={setSail} variant="primary" />
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sun: { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,240,180,0.7)" },
  gull: { position: "absolute", fontSize: 16, color: "rgba(255,255,255,0.7)" },
  content: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greetSmall: { fontFamily: fontBody.medium, fontSize: 14, color: "#0a6b8a" },
  greetName: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#0a4f70", lineHeight: 33 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#ff2e93", alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontDisplay.bold, fontSize: 18, color: "#fff" },
  chooseTitle: { fontFamily: fontDisplay.semiBold, fontSize: 22, color: "#0a4f70", marginTop: 22 },
  chooseSub: { fontFamily: fontBody.medium, fontSize: 13, color: "#0a6b8a", marginTop: 2 },
  boats: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  boatCol: { flex: 1, alignItems: "center", gap: 10 },
  boatRing: { width: "100%", aspectRatio: 1, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "transparent" },
  boatRingActive: { borderColor: "#ffd23f", backgroundColor: "rgba(255,255,255,0.18)" },
  boatImg: { width: "92%", height: "92%" },
  boatLabelRow: { alignItems: "center", gap: 4 },
  boatName: { fontFamily: fontDisplay.semiBold, fontSize: 18, color: "rgba(10,79,112,0.7)" },
  boatNameActive: { color: "#0a4f70" },
  popularTag: { backgroundColor: "#ffd23f", borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  popularText: { fontFamily: fontLabel.extraBold, fontSize: 9, color: "#7a5a00" },
  footer: { gap: 10 },
  meetBtn: { alignItems: "center", paddingVertical: 6 },
  meetText: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#0a4f70" },
  // captain view
  captainWrap: { flex: 1, alignItems: "center", paddingHorizontal: 30 },
  backBtn: { alignSelf: "flex-start", width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  wheel: { width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 6, borderColor: "rgba(200,210,220,0.4)", alignItems: "center", justifyContent: "center", marginTop: 30 },
  captainEyebrow: { fontFamily: fontLabel.extraBold, fontSize: 11, letterSpacing: 1.4, color: "#7fe6ef", marginTop: 22 },
  captainName: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff", marginTop: 4 },
  captainGreet: { fontFamily: fontBody.medium, fontSize: 14, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: 10 },
  captainCta: { alignSelf: "stretch", marginTop: "auto" },
});
