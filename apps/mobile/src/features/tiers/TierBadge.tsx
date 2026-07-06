import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIVER_TIERS, tierIndexFor, tierProgressPct } from "@snorkeling/shared";
import { Text } from "@/components/Text";
import { fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";

interface Props {
  onPress: () => void;
}

/** The always-visible Diver status badge (top-left of the Dive HUD). */
export function TierBadge({ onPress }: Props) {
  const xp = useEconomy((s) => s.xp);
  const tier = DIVER_TIERS[tierIndexFor(xp)];
  const pct = tierProgressPct(xp);

  return (
    <Pressable onPress={onPress} style={styles.badge}>
      <Text style={styles.icon}>{tier.icon}</Text>
      <View style={styles.textCol}>
        <Text style={styles.name}>{tier.name} XP</Text>
        <View style={styles.track}>
          <LinearGradient
            colors={["#16c0d8", "#7fe6ef"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${pct}%` }]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(3,30,44,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    borderRadius: 100,
    paddingVertical: 7,
    paddingLeft: 9,
    paddingRight: 14,
  },
  icon: { fontSize: 18, lineHeight: 20 },
  textCol: { gap: 3 },
  name: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#fff", lineHeight: 12 },
  track: { width: 86, height: 4, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.18)", overflow: "hidden" },
  fill: { height: "100%", borderRadius: 100 },
});
