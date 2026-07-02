import { StyleSheet, View } from "react-native";
import { PhoneSafeArea } from "@/components/PhoneSafeArea";
import { HomeReveal } from "@/components/HomeReveal";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { homeGradient } from "@/theme/tokens";

// Placeholder for Phase 2 — the real pannable ocean world lands in Phase 3.
export default function DiveScreen() {
  return (
    <PhoneSafeArea gradient={homeGradient} disableBottomInset>
      <HomeReveal>
        <View style={styles.content}>
          <View style={styles.hud}>
            <CoinPill coins={0} />
          </View>
          <View style={styles.center}>
            <Text variant="display" color="#fff">
              🌊 The Dive
            </Text>
            <Text variant="body" color="rgba(255,255,255,0.8)" style={styles.subtitle}>
              The pannable ocean world arrives in Phase 3.
            </Text>
          </View>
        </View>
      </HomeReveal>
    </PhoneSafeArea>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  hud: { paddingHorizontal: 16, paddingTop: 8, flexDirection: "row" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 32 },
  subtitle: { textAlign: "center" },
});
