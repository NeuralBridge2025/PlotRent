import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageSquare } from "lucide-react-native";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface items-center justify-center px-6"
      style={{ paddingTop: insets.top }}
    >
      <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
        <MessageSquare color="#32632e" size={32} />
      </View>
      <Text className="font-manrope text-2xl font-bold text-on-surface mb-2">
        Messages
      </Text>
      <Text className="font-inter text-base text-on-surface-variant text-center">
        Chat with hosts and renters
      </Text>
    </View>
  );
}
