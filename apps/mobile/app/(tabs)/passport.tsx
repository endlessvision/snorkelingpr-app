import { StyleSheet, View } from "react-native";
import { PhoneSafeArea } from "@/components/PhoneSafeArea";
import { Text } from "@/components/Text";
import { theme } from "@/theme/tokens";

// Placeholder — full Ocean Passport lands in Phase 6.
export default function PassportScreen() {
  return (
    <PhoneSafeArea backgroundColor={theme.bg}>
      <View style={styles.center}>
        <Text variant="display">⚓ Ocean Passport</Text>
        <Text variant="body" style={styles.subtitle}>
          Stats, stamps, and crew met arrive in Phase 6.
        </Text>
      </View>
    </PhoneSafeArea>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 32 },
  subtitle: { textAlign: "center" },
});
