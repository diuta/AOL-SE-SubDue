import SaveBtn from "@/components/SaveSubscriptionButton";
import { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "expo-router";

export default function AddSubscription() {

    const navigation = useNavigation();
    const [appName, setAppName] = useState('');
    const [price, setPrice] = useState('');
    const [subscriptionDate, setSubscriptionDate] = useState('');
    const [billing, setBilling] = useState('');

    const saveSubscription = async () => {
        const newSubscription = {
            id : uuidv4(),
            appName: appName,
            price: price,
            subscriptionDate: subscriptionDate,
            billing: billing
        };
        const storedData = await AsyncStorage.getItem("subscriptions");
        const subscriptions = storedData ? JSON.parse(storedData) : [];
        subscriptions.push(newSubscription);
        await AsyncStorage.setItem("subscriptions", JSON.stringify(subscriptions));
        navigation.goBack();
    }

  return (
    <View style={styles.mainView}>
      <Text style={styles.subheader}>App Name</Text>
      <TextInput style={styles.textInput} onChangeText={(text) => setAppName(text)}/>

      <Text style={styles.subheader}>Price</Text>
      <TextInput style={styles.textInput} onChangeText={(text) => setPrice(text)}/>

      <Text style={styles.subheader}>Subscription Date</Text>
      <TextInput style={styles.textInput} onChangeText={(text) => setSubscriptionDate(text)}/>
      
      <Text style={styles.subheader}>Billing</Text>
      <TextInput style={styles.textInput} onChangeText={(text) => setBilling(text)}/>

      <TouchableOpacity onPress={saveSubscription} style={styles.button}>
        <Text style={styles.text}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  mainView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "white",
    width: "60%",
    height: 50,
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    padding: 13,
    marginBottom: 30,
  },
  subheader: {
    color: "black",
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "semibold",
  },
  button:{
    marginTop: 70,
    backgroundColor: 'skyblue',
    height: 50,
    width: '20%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
