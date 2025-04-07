import RemoveSubscriptionButton from "@/components/RemoveSubscriptionButton";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatabaseService from "@/utils/DatabaseService";

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
    try {
      const subscriptions = await DatabaseService.getSubscriptions<Subscription>();
      setSubscriptions(subscriptions);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050511" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Subscriptions</Text>
        {subscriptions.length > 0 && (
          <Text style={styles.subHeader}>
            {subscriptions.length} active {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
          </Text>
        )}
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {subscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#4649E5" />
            <Text style={styles.emptyStateText}>No subscriptions yet</Text>
            <Text style={styles.emptyStateSubText}>Add your first subscription to get started</Text>
          </View>
        ) : (
          subscriptions.map((subscription) => (
            <View key={subscription.id} style={styles.subscriptionCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.appName}>{subscription.appName}</Text>
                  <Text style={styles.price}>Rp.{subscription.price},-</Text>
                </View>
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#4649E5" style={styles.icon} />
                    <Text style={styles.detailText}>
                      Due: {subscription.dueDate} ({subscription.billing})
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <RemoveSubscriptionButton
                  id={subscription.id}
                  onUpdate={loadSubscriptions}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050511",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subHeader: {
    color: "#9D9DB5",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateSubText: {
    color: "#9D9DB5",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  subscriptionCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    color: "#4649E5",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    color: "#9D9DB5",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
});
