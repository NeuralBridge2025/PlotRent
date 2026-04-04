import { useState, useCallback, useMemo } from "react";
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
  SlidersHorizontal,
  Sprout,
  RefreshCw,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { usePlots } from "@/hooks/usePlots";
import PlotCard from "@/components/PlotCard";
import FilterModal from "@/components/FilterModal";
import LeafletMap from "@/components/LeafletMap";
import type { Plot, PlotFilters } from "@/types";


export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<PlotFilters>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Only pass filters to the hook when at least one is set
  const activeFilters = useMemo(() => {
    const hasAny = Object.values(filters).some((v) => v != null);
    return hasAny ? filters : undefined;
  }, [filters]);

  const { plots, isLoading, error, refresh } = usePlots(activeFilters);
  const [refreshing, setRefreshing] = useState(false);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v != null && v !== false
  ).length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handlePlotPress = useCallback((id: string) => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    router.push(`/plot/${id}`);
  }, [isAuthenticated]);

  const renderPlotCard = useCallback(
    ({ item, index }: { item: Plot; index: number }) => (
      <View className="px-6 mb-4">
        <PlotCard plot={item} index={index} onPress={handlePlotPress} />
      </View>
    ),
    [handlePlotPress]
  );

  const keyExtractor = useCallback((item: Plot) => item.id, []);

  const ListHeader = (
    <>
      {/* Map */}
      {!isLoading && plots.length > 0 && (
        <View className="px-4 pt-2 pb-2">
          <LeafletMap plots={plots} onPlotPress={handlePlotPress} />
        </View>
      )}

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4"
        contentContainerStyle={{ gap: 10, alignItems: "center" }}
      >
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
          className="bg-primary-container px-3 rounded-full flex-row items-center gap-1.5"
          style={{ height: 34 }}
        >
          <SlidersHorizontal color="#ffffff" size={14} strokeWidth={2.5} />
          <Text className="text-white text-sm font-semibold font-inter">
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            const next = filters.instant_book ? undefined : true;
            setFilters((prev) => ({ ...prev, instant_book: next }));
          }}
          accessibilityRole="button"
          accessibilityLabel="Toggle instant book filter"
          accessibilityState={{ selected: filters.instant_book === true }}
          className={`px-3 py-2 rounded-full justify-center ${
            filters.instant_book ? "bg-primary" : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-sm font-medium font-inter ${
              filters.instant_book ? "text-white" : "text-on-surface"
            }`}
          >
            Instant Book
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Filter by price range"
          className={`px-3 py-2 rounded-full justify-center ${
            filters.min_price != null || filters.max_price != null
              ? "bg-primary"
              : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-sm font-medium font-inter ${
              filters.min_price != null || filters.max_price != null
                ? "text-white"
                : "text-on-surface"
            }`}
          >
            Price Range
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Filter by plot size"
          className={`px-3 py-2 rounded-full justify-center ${
            filters.min_size != null || filters.max_size != null
              ? "bg-primary"
              : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-sm font-medium font-inter ${
              filters.min_size != null || filters.max_size != null
                ? "text-white"
                : "text-on-surface"
            }`}
          >
            Plot Size
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Filter by soil type"
          className={`px-3 py-2 rounded-full justify-center ${
            filters.soil_type != null
              ? "bg-primary"
              : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-sm font-medium font-inter ${
              filters.soil_type != null ? "text-white" : "text-on-surface"
            }`}
          >
            {filters.soil_type ?? "Soil Type"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Results Header */}
      <View className="px-6 pb-4">
        <Text className="font-manrope font-bold text-lg text-primary tracking-tight">
          Available Plots
        </Text>
        {!isLoading && !error && (
          <Text className="text-sm text-on-surface-variant font-inter mt-1">
            {plots.length} {plots.length === 1 ? "result" : "results"} near you
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
      />

      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={(next) => {
          setFilters(next);
          setFilterModalVisible(false);
        }}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
}
