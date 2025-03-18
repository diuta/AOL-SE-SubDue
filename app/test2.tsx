import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

export default function AddSubscriptionScreen() {
  const navigation = useNavigation();
  const [appName, setAppName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState("Monthly");

  const saveSubscription = async () => {
    const newSubscription = { id: uuidv4(), appName, price, billing };
    const storedData = await AsyncStorage.getItem("subscriptions");
    const subscriptions = storedData ? JSON.parse(storedData) : [];
    subscriptions.push(newSubscription);
    await AsyncStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>App Name:</Text>
      <TextInput style={styles.input} value={appName} onChangeText={setAppName} />

      <Text style={styles.label}>Price:</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Billing Cycle:</Text>
      <TextInput style={styles.input} value={billing} onChangeText={setBilling} />

      <Button title="Add Subscription" onPress={saveSubscription} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
