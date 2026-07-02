import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  /** Solid background color. Ignored if `gradient` is set. */
  backgroundColor?: string;
  gradient?: { colors: string[]; locations?: number[] };
  style?: ViewStyle;
  /** Screens like Dive draw their own edge-to-edge world and manage insets themselves. */
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
}

/**
 * The prototypes are shown inside a drawn phone frame at 380x820 — in the
 * real app that frame *is* the device, so screens render full-bleed to the
 * safe area instead of inside a bezel. See design-reference/01-overview.md.
 */
export function PhoneSafeArea({
  children,
  backgroundColor,
  gradient,
  style,
  disableTopInset,
  disableBottomInset,
}: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: disableTopInset ? 0 : insets.top,
    paddingBottom: disableBottomInset ? 0 : insets.bottom,
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient.colors as [string, string, ...string[]]}
        locations={gradient.locations as [number, number, ...number[]] | undefined}
        style={[styles.fill, padding, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor }, padding, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
