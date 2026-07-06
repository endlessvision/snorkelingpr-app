import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";

const STEPS = [
  { emoji: "🤿", title: "Dive the reef", desc: "Drag through a living ocean — the deeper you go, the rarer it gets." },
  { emoji: "🐠", title: "Collect sea life", desc: "Log every species you spot to fill your Ocean Passport." },
  { emoji: "🪙", title: "Earn coins & XP", desc: "Pop bubbles, win mini-games, and rank up your diver status." },
  { emoji: "🎁", title: "Redeem real perks", desc: "Spend coins in the shop or enter the monthly free-tour raffle." },
];

/** First-run explainer. Shown once, then lands on the boat-select Home. */
export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setOnboarded = useEconomy((s) => s.setOnboarded);

  const start = () => {
    setOnboarded();
    router.replace("/home");
  };

  return (
    <LinearGradient colors={["#0a4f70", "#0a3a5c", "#02141f"]} locations={[0, 0.5, 1]} style={styles.fill}>
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.eyebrow}>WELCOME TO</Text>
        <Text style={styles.brand}>Snorkeling Puerto Rico 🌊</Text>

        <View style={styles.steps}>
          {STEPS.map((s) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepIcon}>
                <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button label="Get started 🤿" onPress={start} variant="primary" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 26 },
  eyebrow: { fontFamily: fontLabel.extraBold, fontSize: 12, letterSpacing: 2, color: "#7fe6ef", textAlign: "center" },
  brand: { fontFamily: fontDisplay.semiBold, fontSize: 28, color: "#fff", textAlign: "center", marginTop: 6 },
  steps: { flex: 1, justifyContent: "center", gap: 18 },
  step: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  stepText: { flex: 1 },
  stepTitle: { fontFamily: fontLabel.extraBold, fontSize: 16, color: "#fff" },
  stepDesc: { fontFamily: fontBody.medium, fontSize: 13, color: "rgba(255,255,255,0.78)", marginTop: 2, lineHeight: 18 },
  footer: {},
});
