import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  Star,
  Ruler,
  Sun,
  Droplets,
  Sprout,
  Flower2,
  BadgeCheck,
  RefreshCw,
} from "lucide-react-native";
import { usePlot } from "@/hooks/usePlot";

interface VitalCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function VitalCard({ icon, label, value }: VitalCardProps) {
  return (
    <View className="bg-surface-container-low p-4 rounded-2xl flex-1 min-w-[30%] gap-2">
      {icon}
      <View>
        <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight font-inter">
          {label}
        </Text>
        <Text className="font-bold text-base text-on-surface font-manrope">
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function PlotDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { plot, isLoading, error, refresh } = usePlot(id);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#32632e" />
        <Text className="font-inter text-sm text-on-surface-variant mt-4">
          Loading plot details...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !plot) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
          <RefreshCw color="#a03f29" size={32} />
        </View>
        <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
          {error ?? "Plot not found"}
        </Text>
        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-surface-container-highest px-6 py-3 rounded-full active:opacity-80"
          >
            <Text className="text-on-surface font-inter font-semibold">
              Go Back
            </Text>
          </Pressable>
          <Pressable
            onPress={refresh}
            className="bg-primary px-6 py-3 rounded-full active:opacity-90"
          >
            <Text className="text-white font-inter font-semibold">
              Try Again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const firstImage = plot.images?.[0];

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top + 4 }}
      >
        <Pressable
          onPress={() => router.back()}
          testID="plot-detail-back"
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
        >
          <ArrowLeft color="#32632e" size={22} />
        </Pressable>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share this plot"
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Share2 color="#32632e" size={20} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save to favourites"
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Heart color="#32632e" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View className="h-80 bg-surface-container-high overflow-hidden">
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <MapPin color="#7a757f" size={48} />
            </View>
          )}
          {/* Image Dots */}
          {plot.images && plot.images.length > 1 && (
            <View className="absolute bottom-4 self-center flex-row gap-2">
              {plot.images.slice(0, 5).map((_, i) => (
                <View
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 0 ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Header Card */}
        <View className="px-5 -mt-6 z-10">
          <View className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
            {/* Location */}
            <View className="flex-row items-center gap-1.5 mb-2">
              <MapPin color="#a03f29" size={12} />
              <Text className="text-secondary font-semibold uppercase tracking-widest text-[10px] font-inter">
                {plot.city}, {plot.country}
              </Text>
            </View>

            {/* Title */}
            <Text className="font-manrope font-extrabold text-3xl text-on-surface tracking-tight leading-tight">
              {plot.title}
            </Text>

            {/* Host + Rating Row */}
            <View className="flex-row items-center gap-4 mt-4">
              {/* Host */}
              <View className="flex-row items-center gap-2.5">
                {plot.host_avatar ? (
                  <Image
                    source={{ uri: plot.host_avatar }}
                    className="w-10 h-10 rounded-full border-2 border-primary-container"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="font-manrope font-bold text-primary text-sm">
                      {plot.host_name?.charAt(0) ?? "H"}
                    </Text>
                  </View>
                )}
                <View>
                  <Text className="text-[10px] text-on-surface-variant font-medium font-inter">
                    Hosted by
                  </Text>
                  <Text className="font-bold text-on-surface font-inter text-sm">
                    {plot.host_name ?? "Host"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="h-8 w-px bg-outline-variant/30" />

              {/* Rating */}
              <View>
                <View className="flex-row items-center gap-1">
                  <Star color="#32632e" size={16} fill="#32632e" />
                  <Text className="text-primary font-bold font-inter">
                    {plot.rating?.toFixed(1) ?? "New"}
                  </Text>
                </View>
                <Text className="text-[10px] text-on-surface-variant font-inter">
                  {plot.review_count}{" "}
                  {plot.review_count === 1 ? "review" : "reviews"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plot Vitality */}
        <View className="px-5 mt-8">
          <View className="flex-row items-center gap-2 mb-5">
            <View className="w-6 h-0.5 bg-primary-container" />
            <Text className="font-manrope font-bold text-xl text-on-surface">
              Plot Vitality
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            <VitalCard
              icon={<Ruler color="#32632e" size={28} />}
              label="Size"
              value={`${plot.size_sqm}m²`}
            />
            <VitalCard
              icon={<Sun color="#32632e" size={28} />}
              label="Exposure"
              value={plot.sun_exposure ?? "N/A"}
            />
            <VitalCard
              icon={<Sprout color="#32632e" size={28} />}
              label="Soil"
              value={plot.soil_type ?? "N/A"}
            />
            <VitalCard
              icon={<Droplets color="#32632e" size={28} />}
              label="Water"
              value={
                plot.utilities?.includes("Water Access") ? "Included" : "None"
              }
            />
            <VitalCard
              icon={<Flower2 color="#32632e" size={28} />}
              label="Permitted"
              value="Veggies & Herbs"
            />
          </View>
        </View>

        {/* Plot Passport */}
        {plot.tags && plot.tags.length > 0 && (
          <View className="px-5 mt-8">
            <View className="bg-surface-container-highest/30 rounded-3xl p-6 border-2 border-dashed border-outline-variant/30">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="font-manrope font-black text-xl text-on-surface">
                  Plot Passport™
                </Text>
                <BadgeCheck color="#4a7c44" size={32} />
              </View>
              <View className="flex-row flex-wrap gap-2">
                {plot.tags.map((tag) => (
                  <View
                    key={tag}
                    className="bg-surface-container-lowest px-4 py-2.5 rounded-full shadow-sm"
                  >
                    <Text className="text-on-surface-variant font-bold text-sm font-inter">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        {plot.description && (
          <View className="px-5 mt-8">
            <Text className="font-manrope font-bold text-xl text-on-surface mb-3">
              About this plot
            </Text>
            <Text className="font-inter text-sm text-on-surface-variant leading-relaxed">
              {plot.description}
            </Text>
          </View>
        )}

        {/* Host Insight Card */}
        <View className="px-5 mt-8">
          <View className="bg-primary-container rounded-3xl p-6">
            <View className="flex-row items-center gap-2 mb-3">
              <MapPin color="#ffffff" size={18} />
              <Text className="font-manrope font-bold text-lg text-on-primary">
                Host Insight
              </Text>
            </View>
            <Text className="font-inter text-sm text-on-primary/90 leading-relaxed italic">
              "Get in touch to learn more about this plot and what grows best
              here. I'm happy to share tips for getting started."
            </Text>
            <Pressable
              onPress={() => router.push(`/chat/${plot.host_id}`)}
              testID="plot-detail-message-host"
              className="mt-5 py-3 border border-on-primary/30 rounded-full items-center active:bg-white/10"
            >
              <Text className="font-inter font-bold text-on-primary">
                Message {plot.host_name?.split(" ")[0] ?? "Host"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-surface/95 border-t border-outline-variant/20 px-6 flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 14 }}
      >
        <View>
          <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest font-inter">
            Monthly Rental
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-manrope font-black text-primary">
              €{plot.price_per_month}
            </Text>
            <Text className="text-sm text-on-surface-variant font-inter">
              {" "}
              / mo
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() =>
            router.push({ pathname: "/booking", params: { plotId: plot.id } })
          }
          testID="plot-detail-book-button"
          accessibilityRole="button"
          accessibilityLabel={`Book ${plot.title} for €${plot.price_per_month} per month`}
          className="bg-primary px-8 py-4 rounded-full shadow-lg active:opacity-90"
        >
          <Text className="font-manrope font-bold text-lg text-white">
            Book This Plot
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
