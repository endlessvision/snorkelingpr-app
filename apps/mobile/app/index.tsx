import { StyleSheet, Text, View } from "react-native";

// Phase 0 placeholder — replaced by the opening splash in Phase 2.
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 Snorkeling Puerto Rico</Text>
      <Text style={styles.subtitle}>Phase 0 scaffold — the ocean awaits.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a4f70",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
  },
});
