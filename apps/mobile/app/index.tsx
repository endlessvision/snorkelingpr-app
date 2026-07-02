import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { CoinPill } from "@/components/CoinPill";
import { useAppFonts } from "@/theme/fonts";

// Phase 1 smoke test of the design system — replaced by the opening splash in Phase 2.
export default function Index() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="display" color="#fff">
        🌊 Snorkeling Puerto Rico
      </Text>
      <Text variant="body" color="rgba(255,255,255,0.75)">
        Phase 1 — design system online.
      </Text>
      <CoinPill coins={128} />
      <Button label="Start diving ⚡" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a4f70",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0a4f70",
    alignItems: "center",
    justifyContent: "center",
  },
});
