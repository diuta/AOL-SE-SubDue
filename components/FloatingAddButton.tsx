import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { AppSpecificColors } from "@/constants/Colors";
import { StyleConstants } from "@/constants/StyleConstants";

interface FloatingAddButtonProps {
  onPress: () => void;
}

export default function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={24} color={AppSpecificColors.pureWhite} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 94 : 78, // Just above the tab bar
    right: 24,
    zIndex: 10,
    backgroundColor: AppSpecificColors.floatingButtonBlue,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...StyleConstants.centerAlignment,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});