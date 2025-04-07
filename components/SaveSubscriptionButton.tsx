import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SaveBtn() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Save</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
  },
  text: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    marginTop: 70,
    backgroundColor: "skyblue",
    height: 50,
    width: "20%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
