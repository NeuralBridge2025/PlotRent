import { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Bell,
  BadgeCheck,
  Brain,
  Leaf,
  PartyPopper,
  CalendarDays,
  Settings,
  LogOut,
  ChevronRight,
  Sprout,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 px-1 active:opacity-70"
    >
      <View className="mr-3">{icon}</View>
      <Text
        className={`flex-1 font-inter font-medium text-base ${
          destructive ? "text-secondary" : "text-on-surface"
        }`}
      >
        {label}
      </Text>
      <ChevronRight color={destructive ? "#a03f29" : "#7a757f"} size={20} />
    </Pressable>
  );
}

function formatMemberSince(dateString: string): string {
  const date = new Date(dateString);
  return `Member since ${date.getFullYear()}`;
}

function roleBadgeLabel(role: string): string {
  switch (role) {
    case "host":
      return "Host";
    case "both":
      return "Grower & Host";
    default:
      return "Grower";
  }
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, isAuthenticated, signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  }, [signOut]);

  // Not signed in
  if (!isAuthenticated || !profile) {
    return (
      <View
        className="flex-1 bg-surface items-center justify-center px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <Sprout color="#32632e" size={32} />
        </View>
        <Text className="font-manrope text-2xl font-bold text-on-surface mb-2 text-center">
          Join PlotRent
        </Text>
        <Text className="font-inter text-base text-on-surface-variant text-center mb-6">
          Sign in to manage your plots and bookings.
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          className="bg-primary px-8 py-4 rounded-full active:opacity-90"
        >
          <Text className="font-manrope font-bold text-lg text-white">
            Sign In
          </Text>
        </Pressable>
      </View>
    );
  }

  const initials =
    profile.full_name
      ?.split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="bg-surface/90 px-6 pb-3 flex-row justify-between items-center"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text className="font-manrope text-2xl font-black text-primary tracking-tighter">
          PlotRent
        </Text>
        <Pressable className="p-2 rounded-full active:bg-surface-container-high">
          <Bell color="#32632e" size={24} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeIn.duration(600)}
          className="items-center pt-6 pb-8 px-6"
        >
          {/* Avatar */}
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full bg-primary p-0.5">
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-full h-full rounded-full border-4 border-surface"
                />
              ) : (
                <View className="w-full h-full rounded-full bg-primary-container border-4 border-surface items-center justify-center">
                  <Text className="font-manrope font-bold text-3xl text-white">
                    {initials}
                  </Text>
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-surface">
              <BadgeCheck color="#ffffff" size={16} />
            </View>
          </View>

          {/* Name */}
          <Text className="font-manrope font-bold text-3xl tracking-tight text-on-surface">
            {profile.full_name ?? "PlotRent User"}
          </Text>
          <Text className="font-inter text-sm text-on-surface-variant mt-1">
            {formatMemberSince(profile.member_since)}
          </Text>

          {/* Role Badge */}
          <View className="flex-row mt-3">
            <View className="bg-primary/10 px-4 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Brain color="#32632e" size={14} />
              <Text className="text-primary text-xs font-bold uppercase tracking-wider font-inter">
                {profile.level ?? roleBadgeLabel(profile.role)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Active Rentals */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-baseline mb-4">
            <Text className="font-manrope font-extrabold text-2xl tracking-tight text-on-surface">
              Active Rentals
            </Text>
            <Pressable>
              <Text className="font-inter font-bold text-sm text-primary">
                View History
              </Text>
            </Pressable>
          </View>

          {/* Empty state — will be populated when booking service is wired */}
          <View className="bg-surface-container-low rounded-3xl p-8 items-center">
            <Leaf color="#7a757f" size={28} />
            <Text className="font-inter text-sm text-on-surface-variant mt-3 text-center">
              No active rentals yet.{"\n"}Explore plots to get started!
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-primary px-6 py-3 rounded-full mt-4 active:opacity-90"
            >
              <Text className="font-inter font-semibold text-white">
                Browse Plots
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Garden Achievements */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          className="px-6 mb-8"
        >
          <Text className="font-manrope font-extrabold text-2xl tracking-tight text-on-surface mb-4">
            Garden Achievements
          </Text>
          <View className="bg-surface-container-low rounded-3xl p-6 flex-row justify-around items-center">
            {/* Organic Grower */}
            <View className="items-center gap-2">
              <View className="w-14 h-14 rounded-full bg-secondary/15 items-center justify-center">
                <Leaf color="#a03f29" size={28} />
              </View>
              <Text className="text-[10px] font-black uppercase text-secondary tracking-widest text-center leading-tight font-inter">
                Organic{"\n"}Grower
              </Text>
            </View>

            {/* First Harvest */}
            <View className="items-center gap-2">
              <View className="w-14 h-14 rounded-full bg-primary/15 items-center justify-center">
                <PartyPopper color="#32632e" size={28} />
              </View>
              <Text className="text-[10px] font-black uppercase text-primary tracking-widest text-center leading-tight font-inter">
                First{"\n"}Harvest
              </Text>
            </View>

            {/* Locked */}
            <View className="items-center gap-2 opacity-30">
              <View className="w-14 h-14 rounded-full bg-surface-container-highest items-center justify-center">
                <CalendarDays color="#7a757f" size={28} />
              </View>
              <Text className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest text-center leading-tight font-inter">
                Full{"\n"}Season
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Settings Menu */}
        <View className="px-6 mb-4">
          <Text className="font-manrope font-extrabold text-2xl tracking-tight text-on-surface mb-2">
            Settings
          </Text>
          <View className="bg-surface-container-lowest rounded-3xl px-5 divide-y divide-outline-variant/15">
            <MenuItem
              icon={<Settings color="#32632e" size={20} />}
              label="Account Settings"
              onPress={() => {
                // TODO: settings screen
              }}
            />
            <MenuItem
              icon={<Sprout color="#32632e" size={20} />}
              label="Switch Role"
              onPress={() => router.push("/role-select")}
            />
            <MenuItem
              icon={<LogOut color="#a03f29" size={20} />}
              label="Sign Out"
              onPress={handleSignOut}
              destructive
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
