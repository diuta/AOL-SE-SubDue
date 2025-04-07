import RemoveSubscriptionButton from "@/components/RemoveSubscriptionButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Subscription {
  id: string;
  appName: string;
  price: Int16Array;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
}

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    const storedData = await AsyncStorage.getItem("subscriptions");
    if (!storedData) return;
    const subscriptions: Subscription[] = JSON.parse(storedData);
    setSubscriptions(subscriptions);
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, []),
  );

  return (
    <View style={styles.mainView}>
      <Text style={styles.header}>Subscriptions</Text>
      {subscriptions.map((subscription) => (
        <View key={subscription.id} style={styles.subscriptionCard}>
          <Text>App : {subscription.appName}</Text>
          <Text>Price : Rp.{subscription.price},-</Text>
          <Text>
            Due : {subscription.dueDate} ({subscription.billing})
          </Text>
          <RemoveSubscriptionButton
            id={subscription.id}
            onUpdate={loadSubscriptions}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#050511",
    alignItems: "center",
  },
  header: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    marginTop: "10%",
    marginBottom: "10%",
    fontWeight: "bold",
  },
  subscriptionCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    width: "90%",
  },
});
