import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddSubscriptionButton from "../../components/areas/Subscription/AddSubscriptionButton";
import RemoveSubscriptionButton from "../../components/areas/Subscription/RemoveSubscriptionButton";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the type for navigation
type RootStackParamList = {
  Home: undefined;
  AddSubscription: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Subscription {
  id: string;
  appName: string;
  price: string;
  billing: string;
}

export default function HomeScreen({ navigation }: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    const storedData = await AsyncStorage.getItem("subscriptions");
    if (storedData) {
      setSubscriptions(JSON.parse(storedData));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.appName}>{item.appName}</Text>
            <Text style={styles.details}>
              ${item.price} - {item.billing}
            </Text>
            <RemoveSubscriptionButton
              id={item.id}
              onUpdate={loadSubscriptions}
            />
          </View>
        )}
      />
      <AddSubscriptionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  appName: { fontSize: 18, fontWeight: "bold" },
  details: { fontSize: 14, color: "gray" },
});
