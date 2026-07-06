import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { fontLabel } from "@/theme/fonts";
import { useUI } from "@/store/useUI";

/** Global toast used by overlays that aren't hosted inside the Dive HUD. */
export function GlobalToast() {
  const insets = useSafeAreaInsets();
  const toast = useUI((s) => s.toast);
  const clearToast = useUI((s) => s.clearToast);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(clearToast, 1800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(200)}
      pointerEvents="none"
      style={[styles.wrap, { bottom: insets.bottom + 110 }]}
    >
      <Text style={styles.text}>{toast}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignSelf: "center",
    left: 40,
    right: 40,
    zIndex: 120,
    backgroundColor: "rgba(3,30,44,0.92)",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 100,
  },
  text: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff", textAlign: "center" },
});
