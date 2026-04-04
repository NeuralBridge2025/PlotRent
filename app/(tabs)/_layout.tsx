import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, LayoutList, MessageCircle, User } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

const TAB_ITEMS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "index", label: "Explore", icon: Map },
  { name: "host", label: "Listings", icon: LayoutList },
  { name: "messages", label: "Messages", icon: MessageCircle },
  { name: "profile", label: "Profile", icon: User },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#32632e",
        tabBarInactiveTintColor: "#49454f",
        tabBarLabelStyle: {
          fontFamily: "Inter",
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          backgroundColor: "#fcf9f4",
          borderTopWidth: 1,
          borderTopColor: "#e5e2dd",
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarAccessibilityLabel: `${tab.label} tab`,
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size ?? 24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
