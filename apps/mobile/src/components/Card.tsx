import { View, ViewProps, StyleSheet } from "react-native";
import { radius, shadow, theme } from "@/theme/tokens";

export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, shadow.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radius.card,
    padding: 18,
  },
});
