import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { color, theme, typeScale } from "@/theme/tokens";
import { fontBody, fontDisplay, fontLabel } from "@/theme/fonts";

export type TextVariant = "display" | "heroBig" | "subtitle" | "body" | "label" | "button";

interface Props extends RNTextProps {
  variant?: TextVariant;
  color?: string;
}

const variantStyle = StyleSheet.create({
  display: { fontFamily: fontDisplay.semiBold, fontSize: typeScale.display, color: theme.text },
  heroBig: { fontFamily: fontDisplay.semiBold, fontSize: typeScale.heroBig, color: theme.text },
  subtitle: { fontFamily: fontDisplay.semiBold, fontSize: typeScale.subtitle, color: theme.text },
  body: { fontFamily: fontBody.medium, fontSize: typeScale.body, color: theme.textMuted },
  label: {
    fontFamily: fontLabel.extraBold,
    fontSize: typeScale.label,
    color: theme.textMuted,
    letterSpacing: 0.4,
  },
  button: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff" },
});

export function Text({ variant = "body", style, color: colorOverride, ...rest }: Props) {
  return (
    <RNText
      style={[variantStyle[variant], colorOverride ? { color: colorOverride } : null, style]}
      {...rest}
    />
  );
}

export const palette = color;
