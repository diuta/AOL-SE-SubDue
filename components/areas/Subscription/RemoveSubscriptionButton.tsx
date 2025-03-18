import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RemoveSubscriptionButtonProps {
  id: string;
  onUpdate: () => void;
}

export default function RemoveSubscriptionButton({ id, onUpdate }: RemoveSubscriptionButtonProps) {
  const removeSubscription = async () => {
    const storedData = await AsyncStorage.getItem("subscriptions");
    if (!storedData) return;
    
    const subscriptions: { id: string }[] = JSON.parse(storedData);
    const filteredSubscriptions = subscriptions.filter((sub: { id: string }) => sub.id !== id);
    
    await AsyncStorage.setItem("subscriptions", JSON.stringify(filteredSubscriptions));
    onUpdate(); // Refresh the list
  };

  return (
    <TouchableOpacity style={styles.button} onPress={removeSubscription}>
      <Text style={styles.buttonText}>Remove</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});
