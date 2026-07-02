import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./Text";
import { radius, shadow, spacing } from "@/theme/tokens";
import { fontLabel } from "@/theme/fonts";

export type ButtonVariant = "primary" | "glass" | "light" | "success";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textColor?: string;
}

/** Magenta-gradient CTA + the glassy pill buttons used across the Dive HUD/sheets. */
export function Button({ label, onPress, variant = "primary", disabled, style, textColor }: Props) {
  const content = (
    <Text
      variant="button"
      color={textColor ?? (variant === "glass" ? "#fff" : variant === "light" ? "#0A4F70" : "#fff")}
      style={{ fontFamily: fontLabel.extraBold }}
    >
      {label}
    </Text>
  );

  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, shadow.ctaPink, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={disabled ? ["#7a8a92", "#7a8a92"] : ["#FF5BB0", "#FF2E93"]}
          style={styles.fill}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        styles.padded,
        variant === "glass" && styles.glass,
        variant === "light" && styles.light,
        variant === "success" && styles.success,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  fill: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  padded: {
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
  },
  glass: {
    backgroundColor: "rgba(3,30,44,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  light: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  success: {
    backgroundColor: "#1f9d6b",
  },
  disabled: {
    opacity: 0.5,
  },
});
