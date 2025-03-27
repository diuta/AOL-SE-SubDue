import AddSubscriptionButton from "@/components/AddSubscriptionButton";
import { View, Text, StyleSheet } from "react-native";

export default function SubscriptionList() {
  return (
    <View style={styles.mainView}>
      <Text style={styles.header}>Subscription Card</Text>
      <View style={styles.subscriptionCard}></View>
      <AddSubscriptionButton />
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
    margin: 20,
    fontWeight: "bold",
  },
  subscriptionCard: {
    backgroundColor: "gray",
    width: "80%",
    height: "15%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
  },
});
