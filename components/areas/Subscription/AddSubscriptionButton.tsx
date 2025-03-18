import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AddSubscriptionButton = () => {
  const router = useRouter(); // ✅ Use `useRouter` for navigation

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/test2")} // ✅ Navigate to test2.tsx
    >
      <Text style={styles.buttonText}>Add Subscription</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default AddSubscriptionButton;
