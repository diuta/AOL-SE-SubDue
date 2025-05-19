import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteConstants } from "@/constants/RouteConstants";
import { AppSpecificColors } from "@/constants/Colors";
import { StyleConstants } from "@/constants/StyleConstants";

export default function AddSubscriptionButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        router.push({
          pathname: RouteConstants.ADD_SUBSCRIPTION,
          params: { id: null },
        })
      }
    >
      <Text style={styles.text}>Add Subscription</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: AppSpecificColors.pureBlack,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  button: {
    backgroundColor: AppSpecificColors.skyBlue,
    height: "8%",
    width: "40%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginTop: "10%",
    ...StyleConstants.centerAlignment,
  },
});
