import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ShoppingCart,
  RefreshCw,
  Sprout,
} from "lucide-react-native";
import { useServices } from "@/hooks/useServices";
import type { Service } from "@/types";

const CATEGORIES = ["All Services", "Tools", "Consulting", "Maintenance"];

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const isExpert = service.category.toLowerCase() === "consulting";

  return (
    <View className="bg-surface-container-lowest rounded-xl p-4 shadow-sm mb-6">
      {/* Image */}
      <View className="relative rounded-xl overflow-hidden h-44 mb-4 bg-surface-container-high">
        {service.image_url ? (
          <Image
            source={{ uri: service.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Sprout color="#7a757f" size={32} />
          </View>
        )}
        <View className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface font-inter">
            {service.category}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="px-1">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="font-manrope font-bold text-xl text-on-surface flex-1 mr-2"
            numberOfLines={1}
          >
            {service.title}
          </Text>
          <Text className="font-manrope font-bold text-lg text-secondary">
            €{service.price}
            {service.unit && (
              <Text className="text-xs text-on-surface-variant font-inter font-medium">
                {service.unit}
              </Text>
            )}
          </Text>
        </View>
        <Text className="font-inter text-sm text-on-surface-variant leading-relaxed mb-5">
          {service.description}
        </Text>
      </View>

      {/* CTA */}
      <Pressable className="py-4 rounded-full bg-primary items-center active:opacity-90">
        <Text className="font-inter font-bold text-white tracking-wide">
          {isExpert ? "Book Now" : "Add to Cart"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All Services");
  const categoryFilter =
    activeCategory === "All Services" ? undefined : activeCategory;
  const { services, isLoading, error, refresh } =
    useServices(categoryFilter);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="bg-surface/95 border-b border-outline-variant/10 px-4 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full active:bg-surface-container-high"
          >
            <ArrowLeft color="#32632e" size={22} />
          </Pressable>
          <Text className="font-manrope text-2xl font-black text-primary tracking-tighter">
            PlotRent
          </Text>
        </View>
        <Pressable className="p-2 rounded-full active:bg-surface-container-high">
          <ShoppingCart color="#32632e" size={24} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero */}
        <View className="px-6 pt-6 pb-2">
          <Text className="font-manrope font-bold text-4xl text-on-surface tracking-tight leading-none mb-3">
            Grow Better.
          </Text>
          <Text className="font-inter text-lg text-on-surface-variant leading-relaxed max-w-[90%]">
            Equip your urban plot with professional-grade tools and expert
            services.
          </Text>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-5"
          contentContainerStyle={{ gap: 10 }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full ${
                activeCategory === cat
                  ? "bg-secondary"
                  : "bg-surface-container-highest"
              }`}
            >
              <Text
                className={`text-sm font-semibold font-inter ${
                  activeCategory === cat
                    ? "text-white"
                    : "text-on-surface-variant"
                }`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        {isLoading && !refreshing ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#32632e" />
            <Text className="font-inter text-sm text-on-surface-variant mt-4">
              Loading services...
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
        ) : services.length === 0 ? (
          <View className="items-center justify-center py-20 px-6">
            <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
              <Sprout color="#32632e" size={32} />
            </View>
            <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
              No services available
            </Text>
            <Text className="font-inter text-sm text-on-surface-variant text-center">
              Check back soon for new tools and expert help.
            </Text>
          </View>
        ) : (
          <View className="px-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        {/* Newsletter CTA */}
        <View className="mx-6 mt-4 bg-surface-container rounded-3xl p-8 overflow-hidden">
          <Text className="font-manrope font-bold text-2xl text-on-surface mb-3 text-center">
            Want specialized advice?
          </Text>
          <Text className="font-inter text-sm text-on-surface-variant text-center leading-relaxed mb-6">
            Join our "Agrarian Insights" list for seasonal planting guides and
            exclusive discounts.
          </Text>
          <Pressable className="bg-secondary py-4 rounded-full items-center active:opacity-90">
            <Text className="font-inter font-bold text-white">
              Join the List
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
