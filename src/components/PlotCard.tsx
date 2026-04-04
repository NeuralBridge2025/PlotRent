import { View, Text, Pressable, Image } from "react-native";
import { Ruler, MapPin, Star } from "lucide-react-native";
import type { Plot } from "@/types";

interface PlotCardProps {
  plot: Plot;
  onPress: (id: string) => void;
}

export default function PlotCard({ plot, onPress }: PlotCardProps) {
  const imageUri = plot.images?.[0];

  return (
    <Pressable
      onPress={() => onPress(plot.id)}
      className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm active:opacity-90"
    >
      {/* Image */}
      <View className="h-48 bg-surface-container-high overflow-hidden">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <MapPin color="#7a757f" size={32} />
          </View>
        )}

        {/* Instant Book Badge */}
        {plot.instant_book && (
          <View className="absolute top-3 right-3 bg-secondary px-3 py-1 rounded-full">
            <Text className="text-white text-[10px] font-bold uppercase tracking-widest font-inter">
              Instant Book
            </Text>
          </View>
        )}

        {/* Rating Badge */}
        {plot.rating != null && (
          <View className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 rounded-lg flex-row items-center gap-1">
            <Star color="#f59e0b" size={14} fill="#f59e0b" />
            <Text className="text-xs font-bold text-on-surface font-inter">
              {plot.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title + Price Row */}
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="font-manrope font-bold text-lg text-on-surface flex-1 mr-2"
            numberOfLines={1}
          >
            {plot.title}
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-primary font-bold text-lg font-manrope">
              €{plot.price_per_month}
            </Text>
            <Text className="text-on-surface-variant text-xs font-inter">
              /mo
            </Text>
          </View>
        </View>

        {/* Size + Distance */}
        <View className="flex-row items-center gap-4 mb-3">
          <View className="flex-row items-center gap-1">
            <Ruler color="#78716c" size={14} />
            <Text className="text-on-surface-variant text-sm font-inter">
              {plot.size_sqm}m²
            </Text>
          </View>
          {plot.distance_km != null && (
            <View className="flex-row items-center gap-1">
              <MapPin color="#78716c" size={14} />
              <Text className="text-on-surface-variant text-sm font-inter">
                {plot.distance_km < 1
                  ? `${Math.round(plot.distance_km * 1000)}m away`
                  : `${plot.distance_km.toFixed(1)}km away`}
              </Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {plot.tags && plot.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {plot.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                className="bg-surface-container-highest px-2 py-1 rounded-md"
              >
                <Text className="text-on-surface-variant text-[10px] font-bold uppercase font-inter">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}
