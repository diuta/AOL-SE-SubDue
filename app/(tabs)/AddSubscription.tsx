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
import DatabaseService from "@/utils/DatabaseService";
import DatePicker from "@/components/DatePicker";
import { formatCurrency } from "@/utils/formatUtils";

type Subscription = {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
  category?: string;
};

type ValidationErrors = {
  appName?: string;
  price?: string;
  billing?: string;
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
  const [category, setCategory] = useState<string>("");
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
    // Animation on component moun
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
      setCategory("");
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
    // Allow only numbers and decimal poin
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
      category: category || undefined,
    };

    try {
      await DatabaseService.addSubscription(newSubscription);
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
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.formContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Add Subscription</Text>
            <Text style={styles.subtitle}>
              Enter the details of your subscription
            </Text>
            <Text style={styles.requiredNote}>
              <Text style={styles.requiredIndicator}>*</Text> Required fields
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              App Name <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                touched.appName && errors.appName ? styles.inputError : null,
              ]}
              placeholder="Enter app name"
              placeholderTextColor="#9D9DB5"
              value={appName}
              onChangeText={handleAppNameChange}
            />
            {touched.appName && errors.appName && (
              <Text style={styles.errorText}>{errors.appName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Price <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencyPrefix}>Rp.</Text>
              <TextInput
                style={[
                  styles.priceInput,
                  touched.price && errors.price ? styles.inputError : null,
                ]}
                placeholder="0"
                placeholderTextColor="#9D9DB5"
                keyboardType="numeric"
                value={price}
                onChangeText={handlePriceChange}
              />
            </View>
            {touched.price && errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Subscription Date{" "}
              <Text style={styles.autoFilledNote}>
                (Auto-filled with today)
              </Text>
            </Text>
            <DatePicker
              value={subscriptionDate}
              onChange={setSubscriptionDate}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Billing Cycle <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            {Platform.OS === "ios" ? (
              <TouchableOpacity
                style={[
                  styles.pickerContainer,
                  touched.billing && errors.billing ? styles.inputError : null,
                ]}
                onPress={() => {
                  /* Show iOS picker modal */
                }}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !billing && styles.placeholderText,
                  ]}
                >
                  {billing || "Select billing cycle"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9D9DB5" />
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.pickerContainer,
                  touched.billing && errors.billing ? styles.inputError : null,
                ]}
              >
                <RNPickerSelect
                  onValueChange={handleBillingChange}
                  value={billing}
                  placeholder={{ label: "Select billing cycle", value: "" }}
                  items={[
                    { label: "Daily", value: "Daily" },
                    { label: "Monthly", value: "Monthly" },
                    { label: "Yearly", value: "Yearly" },
                  ]}
                  style={{
                    inputIOS: styles.pickerText,
                    inputAndroid: styles.pickerText,
                    placeholder: styles.placeholderText,
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons name="chevron-down" size={20} color="#9D9DB5" />
                  )}
                />
              </View>
            )}
            {touched.billing && errors.billing && (
              <Text style={styles.errorText}>{errors.billing}</Text>
            )}
          </View>

          {/* Category Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category (Optional)</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={setCategory}
                value={category}
                placeholder={{ label: "Select a category", value: "" }}
                items={[
                  { label: "Entertainment", value: "Entertainment" },
                  { label: "Productivity", value: "Productivity" },
                  { label: "Utilities", value: "Utilities" },
                  { label: "Social Media", value: "Social Media" },
                  { label: "Gaming", value: "Gaming" },
                  { label: "Education", value: "Education" },
                  { label: "Health & Fitness", value: "Health & Fitness" },
                  { label: "Other", value: "Other" },
                ]}
                style={{
                  inputIOS: styles.pickerText,
                  inputAndroid: styles.pickerText,
                  placeholder: styles.placeholderText,
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => (
                  <Ionicons name="chevron-down" size={20} color="#9D9DB5" />
                )}
              />
            </View>
          </View>

          <View style={styles.dueDateContainer}>
            <Text style={styles.dueLabel}>Next payment due:</Text>
            <Text style={styles.dueDate}>
              {format(dueDate, "MMMM d, yyyy")}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveSubscription}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Date picker modal for iOS */}
      {Platform.OS === "ios" && showDatePicker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCloseDatePicker}>
                  <Text style={styles.modalHeaderButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleCloseDatePicker}>
                  <Text
                    style={[styles.modalHeaderButton, { color: "#4649E5" }]}
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
                style={styles.iosDatePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date picker for Android */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={subscriptionDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9D9DB5",
    marginBottom: 4,
  },
  requiredNote: {
    fontSize: 14,
    color: "#9D9DB5",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2D2D44",
  },
  inputError: {
    borderColor: "#FF4D4F",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 14,
    marginTop: 6,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D2D44",
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    color: "#00C853",
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 0,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2D2D44",
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2D2D44",
  },
  pickerText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: "#9D9DB5",
  },
  dueDateContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#2D2D44",
  },
  dueLabel: {
    fontSize: 14,
    color: "#9D9DB5",
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00C853",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4649E5",
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4649E5",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4649E5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#1A1A2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D44",
  },
  modalHeaderButton: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  iosDatePicker: {
    height: 200,
  },
  requiredIndicator: {
    color: "#FF4D4F",
    fontWeight: "bold",
  },
  autoFilledNote: {
    fontSize: 13,
    color: "#9D9DB5",
    fontWeight: "normal",
  },
});
