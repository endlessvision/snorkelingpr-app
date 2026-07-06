import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DAILY_REWARDS } from "@snorkeling/shared";
import { Text } from "@/components/Text";
import { fontBody, fontLabel } from "@/theme/fonts";
import { useEconomy } from "@/store/useEconomy";
import { dateKey } from "@/lib/periods";
import { playSound } from "@/lib/sound";

interface Props {
  onClaimed?: (day: number, reward: number) => void;
}

/** The "Daily Dive" streak card at the top of the Redeem sheet. */
export function DailyDiveCard({ onClaimed }: Props) {
  const streak = useEconomy((s) => s.streak);
  const claimDaily = useEconomy((s) => s.claimDaily);

  const today = dateKey();
  const claimedToday = streak.last === today;
  const streakLabel =
    streak.count > 0 ? `${streak.count}-day streak` : "Start your streak today!";

  const nextDay = claimedToday ? 0 : streak.count + 1;

  const handleClaim = () => {
    const res = claimDaily();
    if (res.ok) {
      playSound("win");
      onClaimed?.(res.day, res.reward);
    }
  };

  return (
    <LinearGradient colors={["#fff4e0", "#ffe6c6"]} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.flame}>🔥</Text>
          <View>
            <Text style={styles.title}>Daily Dive</Text>
            <Text style={styles.streakLabel}>{streakLabel}</Text>
          </View>
        </View>
        {claimedToday ? (
          <Text style={styles.claimed}>✓ Claimed{"\n"}see you tomorrow</Text>
        ) : (
          <Pressable onPress={handleClaim}>
            <LinearGradient colors={["#ff5bb0", "#ff2e93"]} style={styles.claimBtn}>
              <Text style={styles.claimLabel}>Claim</Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>

      <View style={styles.dots}>
        {DAILY_REWARDS.map((reward, i) => {
          const day = i + 1;
          const done = day <= streak.count;
          const isNext = day === nextDay;
          const bg = done ? "#1f9d6b" : isNext ? "#ffb648" : "rgba(10,58,74,0.08)";
          const color = done || isNext ? "#fff" : "#9ab";
          return (
            <View key={day} style={[styles.dot, { backgroundColor: bg }]}>
              <Text style={[styles.dotDay, { color }]}>D{day}</Text>
              <Text style={[styles.dotLabel, { color }]}>+{reward}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.footer}>Come back daily for bonus coins + a free Lucky Reels spin 🎰</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, borderColor: "#ffd9a8", padding: 14, marginBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  flame: { fontSize: 30 },
  title: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#0a3a4a" },
  streakLabel: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#c9760a" },
  claimBtn: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 100 },
  claimLabel: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#fff" },
  claimed: { fontFamily: fontLabel.extraBold, fontSize: 11, color: "#1f9d6b", textAlign: "right" },
  dots: { flexDirection: "row", gap: 5, marginTop: 12 },
  dot: { flex: 1, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  dotDay: { fontFamily: fontLabel.extraBold, fontSize: 7, opacity: 0.8 },
  dotLabel: { fontFamily: fontLabel.extraBold, fontSize: 9, lineHeight: 11 },
  footer: { fontFamily: fontBody.medium, fontSize: 11, color: "#9a7b4a", marginTop: 8 },
});
