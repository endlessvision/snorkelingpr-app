import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppFonts } from "@/theme/fonts";
import { SplashOverlay } from "@/components/SplashOverlay";
import { Text } from "@/components/Text";
import { initEconomyPersistence } from "@/store/persistence";
import { RankUpToast } from "@/features/tiers/RankUpToast";
import { GlobalOverlays } from "@/features/overlays/GlobalOverlays";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);
  const replay = useCallback(() => setShowSplash(true), []);

  // Load the saved economy while the ~2.8s splash plays.
  useEffect(() => {
    void initEconomyPersistence();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.blank} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.root}>
          <Stack screenOptions={{ headerShown: false }} />
          <GlobalOverlays />
          <RankUpToast />
          {showSplash && <SplashOverlay onDone={hideSplash} />}
          {__DEV__ && !showSplash && (
            <Pressable onPress={replay} style={[styles.devReplay, styles.devReplayInner]} hitSlop={10}>
              <Text style={styles.devReplayGlyph}>↻</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blank: { flex: 1, backgroundColor: "#870486" },
  devReplay: {
    position: "absolute",
    top: 50,
    right: 8,
    width: 28,
    height: 28,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  devReplayInner: {
    borderRadius: 14,
    backgroundColor: "rgba(10,79,112,0.35)",
  },
  devReplayGlyph: { color: "#fff", fontSize: 14 },
});
