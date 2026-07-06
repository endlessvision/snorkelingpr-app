import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/Text";
import { fontDisplay, fontBody, fontLabel } from "@/theme/fonts";
import { useUI } from "@/store/useUI";
import { useEconomy } from "@/store/useEconomy";
import { playSound } from "@/lib/sound";

interface Tool {
  key: string;
  emoji: string;
  label: string;
  bg: string;
  border: string;
  onPress: () => void;
}

/** The centered "Dive tools" 2×2 popup opened by the + tab. */
export function ActionMenu() {
  const open = useUI((s) => s.actionMenuOpen);
  const close = useUI((s) => s.closeActionMenu);
  const openScreen = useUI((s) => s.open);
  const muted = useEconomy((s) => s.muted);
  const toggleMuted = useEconomy((s) => s.toggleMuted);

  const scale = useSharedValue(0.9);
  useEffect(() => {
    if (open) {
      scale.value = 0.9;
      scale.value = withTiming(1, { duration: 300, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    }
  }, [open, scale]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!open) return null;

  const tools: Tool[] = [
    { key: "log", emoji: "🔍", label: "Log sighting", bg: "rgba(127,255,208,0.12)", border: "rgba(127,255,208,0.3)", onPress: () => openScreen("logSighting") },
    { key: "games", emoji: "🎮", label: "Mini Games", bg: "rgba(255,229,138,0.12)", border: "rgba(255,229,138,0.3)", onPress: () => openScreen("miniGames") },
    { key: "gear", emoji: "🤿", label: "Gear", bg: "rgba(191,239,255,0.12)", border: "rgba(191,239,255,0.3)", onPress: () => openScreen("gear") },
    {
      key: "sound",
      emoji: muted ? "🔇" : "🔊",
      label: muted ? "Muted" : "Sound",
      bg: "rgba(255,255,255,0.09)",
      border: "rgba(255,255,255,0.22)",
      onPress: () => {
        playSound("coin");
        toggleMuted();
        close();
      },
    },
  ];

  return (
    <Animated.View entering={FadeIn.duration(150)} style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={close} />
      <Animated.View style={popStyle}>
        <LinearGradient colors={["#0a5c84", "#063a54"]} style={styles.menu}>
          <Text style={styles.title}>Dive tools</Text>
          <Text style={styles.subtitle}>Pick what you want to do</Text>
          <View style={styles.grid}>
            {tools.map((t) => (
              <Pressable
                key={t.key}
                onPress={t.onPress}
                style={[styles.tile, { backgroundColor: t.bg, borderColor: t.border }]}
              >
                <Text style={styles.tileEmoji}>{t.emoji}</Text>
                <Text style={styles.tileLabel}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(3,20,32,0.62)" },
  menu: {
    width: 290,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    padding: 18,
    paddingTop: 20,
  },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 20, color: "#fff", textAlign: "center" },
  subtitle: { fontFamily: fontBody.medium, fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: 2, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 11 },
  tile: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    gap: 7,
  },
  tileEmoji: { fontSize: 30 },
  tileLabel: { fontFamily: fontLabel.extraBold, fontSize: 13, color: "#fff" },
});
