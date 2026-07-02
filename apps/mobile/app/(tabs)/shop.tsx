import { StyleSheet, View } from "react-native";
import { PhoneSafeArea } from "@/components/PhoneSafeArea";
import { Text } from "@/components/Text";
import { theme } from "@/theme/tokens";

// Bookings and payments are deferred for this build — see design-reference/01-overview.md.
export default function ShopScreen() {
  return (
    <PhoneSafeArea backgroundColor={theme.bg}>
      <View style={styles.center}>
        <Text variant="display">🛍️ Book</Text>
        <Text variant="body" style={styles.subtitle}>
          Tours &amp; booking coming soon.
        </Text>
      </View>
    </PhoneSafeArea>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 32 },
  subtitle: { textAlign: "center" },
});
