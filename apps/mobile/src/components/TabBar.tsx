import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { TurtleIcon } from "@/svg/TurtleIcon";
import { StarIcon } from "@/svg/StarIcon";
import { Text } from "./Text";
import { shadow } from "@/theme/tokens";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { minTouchTarget } from "@/theme/tokens";

const ACTIVE = "#16C0D8";
const INACTIVE = "#B9C8CF";

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  index: (c) => <TurtleIcon size={24} color={c} />,
  collect: (c) => <StarIcon size={22} color={c} />,
};

const EMOJI: Record<string, string> = { passport: "🛂", shop: "🛍️" };
const LABELS: Record<string, string> = {
  index: "Dive",
  collect: "Collect",
  passport: "Passport",
  shop: "Shop",
};

interface RouteLike {
  key: string;
  name: string;
}

interface NavigationLike {
  navigate: (name: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit: (opts: { type: string; target: string; canPreventDefault: true }) => any;
}

interface Props {
  state: { index: number; routes: RouteLike[] };
  navigation: NavigationLike;
}

/** Custom floating tab bar matching the prototype: Dive, Collect, [+ FAB], Passport, Shop. */
export function TabBar({ state, navigation }: Props) {
  const router = useRouter();
  const routes = state.routes;
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const renderItem = (route: RouteLike) => {
    const isFocused = state.routes[state.index]?.key === route.key;
    const color = isFocused ? ACTIVE : INACTIVE;
    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    return (
      <Pressable key={route.key} onPress={onPress} style={styles.item} hitSlop={8}>
        {ICONS[route.name]?.(color) ?? <Text style={{ fontSize: 18 }}>{EMOJI[route.name]}</Text>}
        <Text variant="label" color={color} style={styles.itemLabel}>
          {LABELS[route.name] ?? route.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.bar}>
      {left.map(renderItem)}
      <Pressable
        onPress={() => router.push("/sighting")}
        style={styles.fabWrap}
        hitSlop={8}
        accessibilityLabel="Register a sighting"
      >
        <LinearGradient colors={["#FF5BB0", "#FF2E93"]} style={[styles.fab, shadow.ctaPink]}>
          <Text style={styles.fabPlus}>+</Text>
        </LinearGradient>
      </Pressable>
      {right.map(renderItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 66,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
    ...shadow.tabBar,
  },
  item: {
    alignItems: "center",
    gap: 3,
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  itemLabel: { fontFamily: fontLabel.extraBold, fontSize: 9 },
  fabWrap: { marginTop: -22 },
  fab: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  fabPlus: { color: "#fff", fontSize: 22, fontFamily: fontDisplay.bold, lineHeight: 24 },
});
