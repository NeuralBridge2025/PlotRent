import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Bell,
  Settings2,
  Sprout,
  RefreshCw,
} from "lucide-react-native";
import { usePlots } from "@/hooks/usePlots";
import PlotCard from "@/components/PlotCard";
import type { Plot, PlotFilters } from "@/types";

const FILTER_CHIPS = ["Distance", "Plot Size", "Price Range", "Instant Book"];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filters] = useState<PlotFilters | undefined>(undefined);
  const { plots, isLoading, error, refresh } = usePlots(filters);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handlePlotPress = useCallback((id: string) => {
    router.push(`/plot/${id}`);
  }, []);

  const renderPlotCard = useCallback(
    ({ item, index }: { item: Plot; index: number }) => (
      <View className="px-6 mb-6">
        <PlotCard plot={item} index={index} onPress={handlePlotPress} />
      </View>
    ),
    [handlePlotPress]
  );

  const keyExtractor = useCallback((item: Plot) => item.id, []);

  const ListHeader = (
    <>
      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4"
        contentContainerStyle={{ gap: 10 }}
      >
        <Pressable className="bg-primary-container px-5 py-2.5 rounded-full flex-row items-center gap-2">
          <Settings2 color="#ffffff" size={16} />
          <Text className="text-white text-sm font-semibold font-inter">
            Filters
          </Text>
        </Pressable>
        {FILTER_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            onPress={() =>
              setActiveFilter(activeFilter === chip ? null : chip)
            }
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${chip}`}
            accessibilityState={{ selected: activeFilter === chip }}
            className={`px-5 py-2.5 rounded-full ${
              activeFilter === chip
                ? "bg-primary"
                : "bg-surface-container-highest"
            }`}
          >
            <Text
              className={`text-sm font-medium font-inter ${
                activeFilter === chip ? "text-white" : "text-on-surface"
              }`}
            >
              {chip}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View className="px-6 pb-4 flex-row justify-between items-baseline">
        <Text className="font-manrope font-bold text-2xl text-primary tracking-tight">
          Available Plots
        </Text>
        {!isLoading && !error && (
          <Text className="text-sm text-on-surface-variant font-inter">
            {plots.length} {plots.length === 1 ? "result" : "results"}
          </Text>
        )}
      </View>
    </>
  );

  const ListEmpty = isLoading && !refreshing ? (
    <View className="items-center justify-center py-20">
      <ActivityIndicator size="large" color="#32632e" />
      <Text className="font-inter text-sm text-on-surface-variant mt-4">
        Finding plots near you...
      </Text>
    </View>
  ) : error ? (
    <View className="items-center justify-center py-20 px-6">
      <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
        <RefreshCw color="#a03f29" size={32} />
      </View>
      <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
        Something went wrong
      </Text>
      <Text className="font-inter text-sm text-on-surface-variant text-center mb-6">
        {error}
      </Text>
      <Pressable
        onPress={refresh}
        className="bg-primary px-6 py-3 rounded-full active:opacity-90"
      >
        <Text className="text-white font-inter font-semibold">
          Try Again
        </Text>
      </Pressable>
    </View>
  ) : (
    <View className="items-center justify-center py-20 px-6">
      <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
        <Sprout color="#32632e" size={32} />
      </View>
      <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
        No plots found
      </Text>
      <Text className="font-inter text-sm text-on-surface-variant text-center">
        Try adjusting your filters or check back later for new listings.
      </Text>
    </View>
  );

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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          className="p-2 rounded-full active:bg-surface-container-high"
        >
          <Bell color="#32632e" size={24} />
        </Pressable>
      </View>

      <FlatList
        data={isLoading || error ? [] : plots}
        renderItem={renderPlotCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={4}
        getItemLayout={(_, index) => ({
          length: 300,
          offset: 300 * index,
          index,
        })}
      />
    </View>
  );
}
