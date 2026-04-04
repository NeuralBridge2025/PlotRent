import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Bell,
  TrendingUp,
  Sparkles,
  Plus,
  LayoutList,
  RefreshCw,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useHostDashboard } from "@/hooks/useHostDashboard";
import type { PlotRow } from "@/lib/database.types";

interface PlotListCardProps {
  plot: PlotRow;
}

function PlotListCard({ plot }: PlotListCardProps) {
  const imageUri = plot.images?.[0];
  const tag = plot.soil_type ?? plot.tags?.[0];

  return (
    <Pressable
      onPress={() => router.push(`/plot/${plot.id}`)}
      className="w-64 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm mr-4 active:opacity-90"
    >
      <View className="h-36 w-full bg-surface-container-high">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <LayoutList color="#7a757f" size={32} />
          </View>
        )}
        {tag && (
          <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-secondary uppercase tracking-wider font-inter">
              {tag}
            </Text>
          </View>
        )}
      </View>
      <View className="p-5">
        <Text
          className="font-manrope font-bold text-lg text-on-surface mb-3"
          numberOfLines={1}
        >
          {plot.title}
        </Text>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest font-inter">
              Size
            </Text>
            <Text className="text-lg font-manrope font-bold text-primary">
              {plot.size_sqm}m²
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest font-inter">
              Revenue
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-lg font-manrope font-bold text-on-surface">
                €{plot.price_per_month}
              </Text>
              <Text className="text-xs text-on-surface-variant font-inter">
                /mo
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HostDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { stats, plots, isLoading, error, refresh } = useHostDashboard(
    user?.id
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "Host";

  // Loading
  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#32632e" />
        <Text className="font-inter text-sm text-on-surface-variant mt-4">
          Loading dashboard...
        </Text>
      </View>
    );
  }

  // Error
  if (error && !stats) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
          <RefreshCw color="#a03f29" size={32} />
        </View>
        <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
          {error}
        </Text>
        <Pressable
          onPress={refresh}
          className="bg-primary px-6 py-3 rounded-full active:opacity-90 mt-4"
        >
          <Text className="text-white font-inter font-semibold">
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

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
        <View className="flex-row items-center gap-3">
          <Pressable className="p-2 rounded-full active:bg-surface-container-high">
            <Bell color="#32632e" size={24} />
          </Pressable>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              className="w-10 h-10 rounded-full border-2 border-primary-container"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-surface-container-highest items-center justify-center border-2 border-primary-container">
              <Text className="font-manrope font-bold text-primary">
                {firstName.charAt(0)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          className="px-6 mt-4 mb-6"
        >
          <Text className="font-manrope font-bold text-3xl tracking-tight text-primary">
            Hi, {firstName}!
          </Text>
          <Text className="font-inter text-base text-on-surface-variant mt-1">
            Your garden plots are thriving today.
          </Text>
        </Animated.View>

        {/* Earnings Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500).springify()}
          className="px-6 mb-6"
        >
          <View className="bg-primary rounded-3xl p-7 overflow-hidden">
            {/* Decorative circle */}
            <View className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />

            <Text className="font-inter text-[11px] uppercase tracking-widest text-white/80 mb-2">
              Earnings this month
            </Text>
            <View className="flex-row items-baseline gap-3 mb-5">
              <Text className="text-5xl font-manrope font-bold text-white">
                €{stats?.monthly_earnings ?? 0}
              </Text>
              {(stats?.earnings_trend ?? 0) > 0 && (
                <View className="flex-row items-center">
                  <TrendingUp color="#a8d5a2" size={16} />
                  <Text className="text-sm font-bold text-white/80 ml-1">
                    {stats?.earnings_trend}%
                  </Text>
                </View>
              )}
            </View>

            <View className="border-t border-white/10 pt-5 flex-row">
              <View className="flex-1">
                <Text className="text-[11px] uppercase tracking-widest text-white/80 font-inter mb-1">
                  Active Plots
                </Text>
                <Text className="text-2xl font-manrope font-bold text-white">
                  {stats?.active_plots ?? 0}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-[11px] uppercase tracking-widest text-white/80 font-inter mb-1">
                  Occupancy
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl font-manrope font-bold text-white">
                    {stats?.occupancy_rate ?? 0}%
                  </Text>
                  {(stats?.occupancy_rate ?? 0) > 50 && (
                    <TrendingUp color="#a8d5a2" size={16} />
                  )}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Host Insights Card */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500).springify()}
          className="px-6 mb-8"
        >
          <View className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
            <Text className="font-manrope font-bold text-xl mb-2">
              Host Insights
            </Text>
            <Text className="font-inter text-sm text-on-surface-variant leading-relaxed">
              {plots.length > 0
                ? `Your "${plots[0].title}" is performing well. Consider adjusting pricing for peak season.`
                : "List your first plot to start earning from your land."}
            </Text>
            <Pressable
              onPress={() =>
                plots.length > 0
                  ? router.push(`/plot/${plots[0].id}`)
                  : router.push("/create-plot")
              }
              className="bg-secondary py-4 rounded-full mt-5 flex-row items-center justify-center gap-2 active:opacity-90"
            >
              <Text className="font-inter font-bold text-white">
                {plots.length > 0 ? "Optimise Price" : "List a Plot"}
              </Text>
              <Sparkles color="#ffffff" size={16} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Your Plots Section */}
        <View className="mb-8">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <Text className="font-manrope font-bold text-2xl">Your Plots</Text>
            {plots.length > 0 && (
              <Pressable>
                <Text className="font-inter font-bold text-sm text-primary">
                  Manage All
                </Text>
              </Pressable>
            )}
          </View>

          {plots.length === 0 ? (
            <View className="px-6 py-10 items-center">
              <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                <LayoutList color="#32632e" size={32} />
              </View>
              <Text className="font-manrope text-lg font-bold text-on-surface mb-2">
                No plots yet
              </Text>
              <Text className="font-inter text-sm text-on-surface-variant text-center">
                Create your first listing to start earning.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            >
              {plots.map((plot) => (
                <PlotListCard key={plot.id} plot={plot} />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/create-plot")}
        className="absolute right-6 w-14 h-14 bg-secondary rounded-full shadow-lg items-center justify-center active:opacity-90"
        style={{ bottom: insets.bottom + 88 }}
      >
        <Plus color="#ffffff" size={28} />
      </Pressable>
    </View>
  );
}
