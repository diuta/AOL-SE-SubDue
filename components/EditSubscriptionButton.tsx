import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface EditSubscriptionButtonProps {
  id: string;
}

export default function EditSubscriptionButton({
  id,
}: EditSubscriptionButtonProps) {
  const router = useRouter();
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

  const handleEditPress = () => {
    router.push({
      pathname: "/AddSubscription",
      params: { id },
    });
  };

  // Use conditional rendering based on platform
  if (Platform.OS === "web") {
    // On web, use regular TouchableOpacity without animations
    return (
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={handleEditPress}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="pencil" size={16} color="#4649E5" />
        </View>
        <Text style={styles.buttonText}>Edit</Text>
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
      onPress={handleEditPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="pencil" size={16} color="#4649E5" />
      </View>
      <Text style={styles.buttonText}>Edit</Text>
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
    backgroundColor: "rgba(70, 73, 229, 0.1)",
    marginRight: 8,
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
    color: "#4649E5",
    fontSize: 14,
    fontWeight: "600",
  },
});
