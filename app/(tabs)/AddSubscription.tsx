import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useFocusEffect, useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { addDays, addMonths, addYears, format } from "date-fns";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Subscription = {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
};

type ValidationErrors = {
  appName?: string;
  price?: string;
  billing?: string;
};

// Database service for cross-platform storage
const DatabaseService = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export default function AddSubscription() {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [appName, setAppName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [subscriptionDate, setSubscriptionDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [billing, setBilling] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isWeb, setIsWeb] = useState<boolean>(Platform.OS === "web");
  const [slideAnim] = useState(new Animated.Value(100));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    appName: false,
    price: false,
    billing: false,
  });

  useEffect(() => {
    // Animation on component mount
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setAppName("");
      setPrice("");
      setSubscriptionDate(new Date());
      setDueDate(new Date());
      setBilling("");
      setErrors({});
      setTouched({
        appName: false,
        price: false,
        billing: false,
      });
    }, []),
  );

  // Update the due date whenever subscription date or billing changes
  const updateDueDate = (date: Date, billingCycle: string) => {
    let newDueDate = date;
    if (billingCycle === "Daily") {
      newDueDate = addDays(date, 1);
    } else if (billingCycle === "Monthly") {
      newDueDate = addMonths(date, 1);
    } else if (billingCycle === "Yearly") {
      newDueDate = addYears(date, 1);
    }
    setDueDate(newDueDate);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // For Android, we need to hide the picker after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setSubscriptionDate(selectedDate);
      // Update the due date based on the selected date and current billing cycle
      updateDueDate(selectedDate, billing);
    }
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleBillingChange = (value: string) => {
    setBilling(value);
    setTouched((prev) => ({ ...prev, billing: true }));
    validateField("billing", value);
    // Update the due date based on the current subscription date and new billing cycle
    updateDueDate(subscriptionDate, value);
  };

  const handleAppNameChange = (value: string) => {
    setAppName(value);
    setTouched((prev) => ({ ...prev, appName: true }));
    validateField("appName", value);
  };

  const handlePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === "" || /^\d+(\.\d*)?$/.test(value)) {
      setPrice(value);
      setTouched((prev) => ({ ...prev, price: true }));
      validateField("price", value);
    }
  };

  const validateField = (field: string, value: string) => {
    let newErrors = { ...errors };

    switch (field) {
      case "appName":
        if (!value.trim()) {
          newErrors.appName = "App name is required";
        } else {
          delete newErrors.appName;
        }
        break;
      case "price":
        if (!value.trim()) {
          newErrors.price = "Price is required";
        } else if (parseFloat(value) <= 0) {
          newErrors.price = "Price must be greater than zero";
        } else {
          delete newErrors.price;
        }
        break;
      case "billing":
        if (!value) {
          newErrors.billing = "Please select a billing cycle";
        } else {
          delete newErrors.billing;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!appName.trim()) {
      newErrors.appName = "App name is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (parseFloat(price) <= 0) {
      newErrors.price = "Price must be greater than zero";
    }

    if (!billing) {
      newErrors.billing = "Please select a billing cycle";
    }

    setErrors(newErrors);
    setTouched({
      appName: true,
      price: true,
      billing: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const formattedDate = format(subscriptionDate, "dd MMMM yyyy");
  const formattedDueDate = format(dueDate, "dd MMMM yyyy");

  const saveSubscription = async () => {
    if (!validateForm()) {
      return;
    }

    const newSubscription: Subscription = {
      id: uuidv4(),
      appName,
      price,
      subscriptionDate: formattedDate,
      dueDate: formattedDueDate,
      billing,
    };

    try {
      const storedData = await DatabaseService.getItem("subscriptions");
      const subscriptions = storedData ? JSON.parse(storedData) : [];
      subscriptions.push(newSubscription);
      await DatabaseService.setItem(
        "subscriptions",
        JSON.stringify(subscriptions),
      );
      router.replace("/");
    } catch (error) {
      console.error("Error saving subscription:", error);
      // You could add error handling UI here
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>
          Add Subscription
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.mainView,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.formGroup}>
            <Text style={[styles.subheader, { color: colors.text }]}>
              App Name
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="apps"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.card,
                    borderColor:
                      touched.appName && errors.appName
                        ? colors.danger
                        : colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                onChangeText={handleAppNameChange}
                value={appName}
                placeholder="Enter app name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            {touched.appName && errors.appName && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errors.appName}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.subheader, { color: colors.text }]}>
              Price
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="cash-outline"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.card,
                    borderColor:
                      touched.price && errors.price
                        ? colors.danger
                        : colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                onChangeText={handlePriceChange}
                value={price}
                keyboardType="numeric"
                placeholder="Enter price"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            {touched.price && errors.price && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errors.price}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.subheader, { color: colors.text }]}>
              Subscription Start Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.selectButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <Text style={{ color: colors.text }}>
                {format(subscriptionDate, "EEEE, MMMM d, yyyy")}
              </Text>
              <View style={styles.editIconContainer}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>

            {Platform.OS === "android" && showDatePicker && (
              <DateTimePicker
                value={subscriptionDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {Platform.OS === "ios" && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={handleCloseDatePicker}
              >
                <View style={styles.modalContainer}>
                  <View
                    style={[
                      styles.datePickerContainer,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <View style={styles.datePickerHeader}>
                      <Text
                        style={[styles.datePickerTitle, { color: colors.text }]}
                      >
                        Select Start Date
                      </Text>
                      <TouchableOpacity onPress={handleCloseDatePicker}>
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={subscriptionDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      style={{ height: 200 }}
                      textColor={colors.text}
                    />
                  </View>
                </View>
              </Modal>
            )}

            {Platform.OS === "web" && showDatePicker && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={handleCloseDatePicker}
              >
                <View style={styles.modalContainer}>
                  <View
                    style={[
                      styles.datePickerContainer,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <View style={styles.datePickerHeader}>
                      <Text
                        style={[styles.datePickerTitle, { color: colors.text }]}
                      >
                        Select Start Date
                      </Text>
                      <TouchableOpacity onPress={handleCloseDatePicker}>
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.webDatePickerContainer}>
                      <input
                        type="date"
                        value={format(subscriptionDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setSubscriptionDate(newDate);
                          updateDueDate(newDate, billing);
                        }}
                        style={{
                          width: "100%",
                          padding: 12,
                          fontSize: 16,
                          borderRadius: 8,
                          border: `1px solid ${colors.cardBorder}`,
                          backgroundColor: colors.background,
                          color: colors.text,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.subheader, { color: colors.text }]}>
              Billing Cycle
            </Text>
            <View
              style={[
                styles.selectButton,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    touched.billing && errors.billing
                      ? colors.danger
                      : colors.cardBorder,
                },
              ]}
            >
              <Ionicons
                name="repeat-outline"
                size={22}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <RNPickerSelect
                onValueChange={handleBillingChange}
                value={billing}
                placeholder={{ label: "Select billing cycle", value: "" }}
                style={{
                  inputIOS: {
                    color: colors.text,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    width: "100%",
                  },
                  inputAndroid: { color: colors.text, width: "100%" },
                }}
                items={[
                  { label: "Daily", value: "Daily" },
                  { label: "Monthly", value: "Monthly" },
                  { label: "Yearly", value: "Yearly" },
                ]}
              />
            </View>
            {touched.billing && errors.billing && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errors.billing}
              </Text>
            )}
          </View>

          {billing && (
            <View style={styles.dueContainer}>
              <Text style={[styles.dueLabel, { color: colors.textSecondary }]}>
                Next payment due on:
              </Text>
              <Text style={[styles.dueDate, { color: colors.primary }]}>
                {formattedDueDate}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleCancel}
          style={[styles.cancelButton, { borderColor: colors.primary }]}
        >
          <Text style={[styles.cancelButtonText, { color: colors.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveSubscription}
          style={[
            styles.saveButton,
            {
              backgroundColor:
                Object.keys(errors).length > 0 || !appName || !price || !billing
                  ? colors.textSecondary // Disabled state color
                  : colors.primary,
            },
          ]}
          disabled={
            Object.keys(errors).length > 0 || !appName || !price || !billing
          }
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  mainView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 25,
  },
  subheader: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  inputIcon: {
    position: "absolute",
    zIndex: 1,
    left: 15,
  },
  textInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 46,
    fontSize: 16,
  },
  selectButton: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 46,
    paddingRight: 46,
    justifyContent: "center",
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    right: 15,
    backgroundColor: "rgba(108, 92, 231, 0.1)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  dueContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  dueLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  cancelButton: {
    height: 56,
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    height: 56,
    flex: 1,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },
  webDatePickerContainer: {
    padding: 10,
    alignItems: "center",
  },
});
