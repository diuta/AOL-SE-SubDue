import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RemoveSubscriptionButtonProps {
  id: string;
  onUpdate: () => void;
}

export default function RemoveSubscriptionButton({
  id,
  onUpdate,
}: RemoveSubscriptionButtonProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const removeSubscription = async () => {
    Alert.alert(
      "Remove Subscription",
      "Are you sure you want to remove this subscription?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const storedData = await AsyncStorage.getItem("subscriptions");
            console.log("clicked");
            if (!storedData) {
              console.log("Stored data not available");
              return;
            }

            const subscriptions: { id: string }[] = JSON.parse(storedData);
            const filteredSubscriptions = subscriptions.filter(
              (sub: { id: string }) => sub.id !== id,
            );

            await AsyncStorage.setItem(
              "subscriptions",
              JSON.stringify(filteredSubscriptions),
            );
            onUpdate();
          },
        },
      ],
    );
  };

  // Use Animated.createAnimatedComponent to create an animated TouchableOpacity
  // This avoids the nested structure that might interfere with touch events
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        {
          backgroundColor: colors.danger,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      activeOpacity={0.7}
      onPress={removeSubscription}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Ionicons
        name="trash-outline"
        size={14}
        color="#FFF"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>Remove</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
