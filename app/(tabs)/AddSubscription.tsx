import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useFocusEffect, useRouter } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import RNPickerSelect from 'react-native-picker-select';
import { addDays, addMonths, addYears, format } from "date-fns";

type Subscription = {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
};

export default function AddSubscription() {
  
  const router = useRouter();
  const [appName, setAppName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [subscriptionDate, setSubscriptionDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [billing, setBilling] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      setAppName("");
      setPrice("");
      setSubscriptionDate(new Date());
      setDueDate(new Date());
      setBilling("");
    }, [])
  );

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Hide the picker after selection
    setShowDatePicker(false);
    if (selectedDate) {
      setSubscriptionDate(selectedDate);

      let newDueDate = selectedDate;
      if (billing === "Daily") {
        newDueDate = addDays(selectedDate, 1);
      } else if (billing === "Monthly") {
        newDueDate = addMonths(selectedDate, 1);
      } else if (billing === "Yearly") {
        newDueDate = addYears(selectedDate, 1);
      }

      setDueDate(newDueDate);
    }
  };

  const handleBillingChange = (value: string) => {
    setBilling(value);
  
    let newDueDate = subscriptionDate;
    if (value === "Daily") {
      newDueDate = addDays(subscriptionDate, 1);
    } else if (value === "Monthly") {
      newDueDate = addMonths(subscriptionDate, 1);
    } else if (value === "Yearly") {
      newDueDate = addYears(subscriptionDate, 1);
    }
    
    setDueDate(newDueDate);
  };

  const formattedDate = format(subscriptionDate, "dd MMMM yyyy");
  const formattedDueDate = format(dueDate, "dd MMMM yyyy");

  const saveSubscription = async () => {
    const newSubscription: Subscription = {
      id: uuidv4(),
      appName,
      price,
      subscriptionDate: formattedDate,
      dueDate: formattedDueDate,
      billing,
    };

    const storedData = await AsyncStorage.getItem("subscriptions");
    const subscriptions = storedData ? JSON.parse(storedData) : [];
    subscriptions.push(newSubscription);
    await AsyncStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    router.replace("/");
  };

  return (
    <View style={styles.mainView}>
      <Text style={styles.subheader}>App Name</Text>
      <TextInput style={styles.textInput} onChangeText={setAppName} value={appName} />

      <Text style={styles.subheader}>Price</Text>
      <TextInput style={styles.textInput} onChangeText={setPrice} value={price} keyboardType="numeric" />

      <Text style={styles.subheader}>Subscription Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.selectButton} >
        <Text>{subscriptionDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && ( <DateTimePicker value={subscriptionDate} mode="date" display={Platform.OS === "android" ? "spinner" : "default"} onChange={handleDateChange} />)}

      <Text style={styles.subheader}>Billing</Text>
      <View style={styles.selectButton} >
        <RNPickerSelect onValueChange={handleBillingChange} value={billing} items={[
          { label: 'Daily', value: 'Daily' },
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Yearly', value: 'Yearly' }, ]} />
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity onPress={saveSubscription} style={styles.saveButton}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#050511",
    alignItems: "center",
    justifyContent: "center",
  },
  subheader: {
    color: "white",
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "600",
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
  selectButton: {
    backgroundColor: "white",
    width: "60%",
    height: 50,
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    padding: 13,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: "#4649E5",
    height: 50,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
  },
});
