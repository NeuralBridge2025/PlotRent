import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, LayoutList, MessageSquare, User } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

const TAB_ITEMS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "index", label: "Explore", icon: Map },
  { name: "host", label: "Listings", icon: LayoutList },
  { name: "messages", label: "Messages", icon: MessageSquare },
  { name: "profile", label: "Profile", icon: User },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#a8a29e",
        tabBarLabelStyle: {
          fontFamily: "Inter",
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 72 + insets.bottom,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8,
          backgroundColor: "rgba(252, 249, 244, 0.92)",
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 12,
          ...Platform.select({
            ios: {
              shadowColor: "#1c1b18",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 24,
            },
          }),
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          paddingVertical: 4,
        },
        tabBarActiveBackgroundColor: "#32632e",
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size ?? 24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
