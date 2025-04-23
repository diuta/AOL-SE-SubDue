import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
  View,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatabaseService from "@/utils/DatabaseService";

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
    if (Platform.OS === "web") {
      // For web, use browser's native confirm dialog
      const isConfirmed = window.confirm(
        "Are you sure you want to remove this subscription?",
      );

      if (isConfirmed) {
        try {
          await DatabaseService.removeSubscriptionById(id);
          onUpdate();
        } catch (error) {
          console.error("Error removing subscription:", error);
        }
      }
    } else {
      // For native platforms, use Alert.alert
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
              try {
                await DatabaseService.removeSubscriptionById(id);
                onUpdate();
              } catch (error) {
                console.error("Error removing subscription:", error);
              }
            },
          },
        ],
      );
    }
  };

  // Use conditional rendering based on platform
  if (Platform.OS === "web") {
    // On web, use regular TouchableOpacity without animations
    return (
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={removeSubscription}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="trash-outline" size={16} color="#FF4D4F" />
        </View>
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    );
  }

  // For native platforms, use the animated version
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
      activeOpacity={0.7}
      onPress={removeSubscription}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="trash-outline" size={16} color="#FF4D4F" />
      </View>
      <Text style={styles.buttonText}>Remove</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 77, 79, 0.1)",
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  buttonText: {
    color: "#FF4D4F",
    fontSize: 14,
    fontWeight: "600",
  },
});
