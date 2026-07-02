import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tabBar={(props) => <TabBar state={props.state} navigation={props.navigation as any} />}
    >
      <Tabs.Screen name="index" options={{ title: "Dive" }} />
      <Tabs.Screen name="collect" options={{ title: "Collect" }} />
      <Tabs.Screen name="passport" options={{ title: "Passport" }} />
      <Tabs.Screen name="shop" options={{ title: "Shop" }} />
    </Tabs>
  );
}
