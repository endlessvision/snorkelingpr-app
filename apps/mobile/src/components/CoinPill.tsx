import { View, StyleSheet } from "react-native";
import { CoinIcon } from "@/svg/CoinIcon";
import { Text } from "./Text";
import { fontDisplay } from "@/theme/fonts";
import { radius } from "@/theme/tokens";

interface Props {
  coins: number;
  /** "dark" for use over light backgrounds (redeem sheets), "glass" for over the ocean HUD. */
  variant?: "glass" | "dark";
}

/** The coin-balance pill shown across the Dive HUD, Gear locker, Redeem sheets, and Coin Shop. */
export function CoinPill({ coins, variant = "glass" }: Props) {
  return (
    <View style={[styles.pill, variant === "glass" ? styles.glass : styles.dark]}>
      <CoinIcon size={20} />
      <Text
        style={{ fontFamily: fontDisplay.semiBold, fontSize: 16 }}
        color={variant === "glass" ? "#fff" : "#0A4F70"}
      >
        {coins}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 7,
    paddingLeft: 9,
    paddingRight: 13,
    borderRadius: radius.pill,
  },
  glass: {
    backgroundColor: "rgba(3,30,44,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  dark: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2eef1",
  },
});
