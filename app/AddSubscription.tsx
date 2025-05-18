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
  Image,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { nanoid } from "nanoid/non-secure";
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { addDays, addMonths, addYears, format, parse } from "date-fns";
import { Colors, AppSpecificColors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatabaseService from "@/utils/DatabaseService";
import DatePicker from "@/components/DatePicker";
import { formatCurrency } from "@/utils/formatUtils";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { defaultImages } from "@/constants/ImageConstants";
import { VALID_ICONS, type IconName } from "@/constants/IconConstants";
import CustomEnumPicker, { PickerItem } from "@/components/CustomEnumPicker";

// Define makeStyles outside and before the component
const makeStyles = (colors: typeof Colors.light, platformOS: typeof Platform.OS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      padding: 24,
    },
    headerContainer: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    requiredNote: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    requiredIndicator: {
      color: colors.danger,
    },
    formGroup: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 16,
      color: colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      minHeight: 56,
    },
    inputError: {
      borderColor: colors.danger,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
    },
    priceInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 16,
      minHeight: 56,
    },
    currencyPrefix: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "500",
      marginRight: 8,
    },
    priceInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 16,
      paddingLeft: 0,
    },
    autoFilledNote: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "normal",
    },
    iconScrollView: {},
    iconPickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 4,
    },
    iconOption: {
      width: 44,
      height: 44,
      borderRadius: 22,
      padding: 10,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    selectedIconOption: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    imagePickerButton: {
      backgroundColor: "transparent",
      borderColor: colors.primary,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: "center",
      marginBottom: 12,
      minHeight: 50,
    },
    imagePickerButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    previewImage: {
      width: "100%",
      height: 180,
      borderRadius: 10,
      marginTop: 16,
      backgroundColor: colors.cardBorder,
    },
    dueDateContainer: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 16,
      marginTop: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    dueLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    dueDate: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.accent,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      gap: 16,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: "center",
      minHeight: 50,
    },
    cancelButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    saveButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.primary,
      minHeight: 50,
    },
    saveButtonText: {
      color: AppSpecificColors.pureWhite,
      fontSize: 16,
      fontWeight: "600",
    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalView: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      ...(Platform.select({
        ios: {
          shadowColor: AppSpecificColors.pureBlack,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 10,
        },
        web: {
          boxShadow: `0px -3px 6px rgba(0,0,0,0.1)`,
          borderWidth: 1,
          borderColor: 'transparent',
        }
      })),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 16,
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
    },
    modalHeaderButton: {
      fontSize: 16,
      color: colors.primary,
      padding: 8,
      fontWeight: "500",
    },
    modalHeaderTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    iosDatePicker: {
      width: "100%",
    },
  });

// Export the Subscription type
export type Subscription = {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
  category?: string;
  icon?: string;
  customImage?: string;
  reminder?: string;
};

export type ValidationErrors = {
  appName?: string;
  price?: string;
  billing?: string;
};

export default function AddSubscription() {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams();
  const subscriptionId = params.id as string;
  const isEditMode = !!subscriptionId && subscriptionId.trim() !== "";
  const styles = makeStyles(colors, Platform.OS);

  const [appName, setAppName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [subscriptionDate, setSubscriptionDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [billing, setBilling] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [icon, setIcon] = useState<IconName | "">("");
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isWeb, setIsWeb] = useState<boolean>(Platform.OS === "web");
  const [slideAnim] = useState(new Animated.Value(100));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [reminder, setReminder] = useState<string | undefined>("none");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    appName: false,
    price: false,
    billing: false,
  });

  useEffect(() => {
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

    if (isEditMode) {
      loadSubscriptionData();
    } else {
      setReminder("none");
    }
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const subscriptions =
        await DatabaseService.getSubscriptions<Subscription>();
      const subscription = subscriptions.find(
        (sub) => sub.id === subscriptionId
      );

      if (subscription) {
        setAppName(subscription.appName);
        setPrice(subscription.price);
        const parsedSubscriptionDate = parse(
          subscription.subscriptionDate,
          "dd MMMM yyyy",
          new Date()
        );
        setSubscriptionDate(parsedSubscriptionDate);
        const parsedDueDate = parse(
          subscription.dueDate,
          "dd MMMM yyyy",
          new Date()
        );
        setDueDate(parsedDueDate);
        setBilling(subscription.billing);
        setCategory(subscription.category || "");
        setIcon((subscription.icon as IconName) || "");
        setCustomImageUri(subscription.customImage || null);
        setReminder(subscription.reminder || "none");
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isEditMode) {
        setAppName("");
        setPrice("");
        setSubscriptionDate(new Date());
        setDueDate(new Date());
        setBilling("");
        setCategory("");
        setIcon("");
        setCustomImageUri(null);
        setReminder("none");
        setErrors({});
        setTouched({
          appName: false,
          price: false,
          billing: false,
        });
      } else {
        loadSubscriptionData();
      }
    }, [isEditMode])
  );

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
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSubscriptionDate(selectedDate);
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
    updateDueDate(subscriptionDate, value);
    setReminder("none");
  };

  const handleAppNameChange = (value: string) => {
    setAppName(value);
    setTouched((prev) => ({ ...prev, appName: true }));
    validateField("appName", value);
  };

  const handlePriceChange = (value: string) => {
    if (value === "" || /^\\d+(\\.\\d*)?$/.test(value)) {
      setPrice(value);
      setTouched((prev) => ({ ...prev, price: true }));
      validateField("price", value);
    }
  };

  const validateField = (field: string, value: string) => {
    let newErrors = { ...errors };
    switch (field) {
      case "appName":
        if (!value.trim()) newErrors.appName = "App name is required";
        else delete newErrors.appName;
        break;
      case "price":
        if (!value.trim()) newErrors.price = "Price is required";
        else if (parseFloat(value) <= 0)
          newErrors.price = "Price must be greater than zero";
        else delete newErrors.price;
        break;
      case "billing":
        if (!value) newErrors.billing = "Please select a billing cycle";
        else delete newErrors.billing;
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    if (!appName.trim()) newErrors.appName = "App name is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (parseFloat(price) <= 0)
      newErrors.price = "Price must be greater than zero";
    if (!billing) newErrors.billing = "Please select a billing cycle";
    setErrors(newErrors);
    setTouched({ appName: true, price: true, billing: true });
    return Object.keys(newErrors).length === 0;
  };

  const formattedDate = format(subscriptionDate, "dd MMMM yyyy");
  const formattedDueDate = format(dueDate, "dd MMMM yyyy");

  const saveSubscription = async () => {
    if (!validateForm()) return;
    let imageToSave = customImageUri;
    if (!imageToSave) {
      const matchedDefaultImageKey = Object.keys(defaultImages).find((key) =>
        appName.toLowerCase().includes(key.toLowerCase())
      );
      if (matchedDefaultImageKey) imageToSave = matchedDefaultImageKey;
    }
    const subscriptionData: Subscription = {
      id: isEditMode ? subscriptionId : nanoid(),
      appName,
      price,
      subscriptionDate: formattedDate,
      dueDate: formattedDueDate,
      billing,
      category: category || undefined,
      icon: icon || undefined,
      customImage: imageToSave || undefined,
      reminder: reminder === "none" ? undefined : reminder,
    };
    try {
      if (isEditMode)
        await DatabaseService.updateSubscriptionById(
          subscriptionId,
          subscriptionData
        );
      else await DatabaseService.addSubscription(subscriptionData);
      router.replace("/");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} subscription:`,
        error
      );
    }
  };

  const handleCancel = () => router.back();

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      if (Platform.OS === "web") {
        setCustomImageUri(selectedAsset.uri);
      } else {
        const fileName = selectedAsset.uri.split("/").pop();
        if (FileSystem.documentDirectory && fileName) {
          const newPath = FileSystem.documentDirectory + fileName;
          try {
            await FileSystem.copyAsync({ from: selectedAsset.uri, to: newPath });
            setCustomImageUri(newPath);
          } catch (e) {
            console.error("Error copying image:", e);
            alert("Failed to save image.");
          }
        } else {
          console.error(
            "Error: Document directory or filename is not available."
          );
          alert("Failed to save image.");
        }
      }
    }
  };

  const getReminderOptions = (currentBillingCycle: string): PickerItem[] => {
    const options: PickerItem[] = [{ label: "None", value: "none" }];
    if (!currentBillingCycle) return options;

    options.push({ label: "On due date", value: "on_due_date" });

    if (currentBillingCycle === "Daily") {
      // For Daily, perhaps only "On due date" makes sense beyond "None"
    } else if (currentBillingCycle === "Monthly") {
      options.push({ label: "1 day before", value: "1_day_before" });
      options.push({ label: "3 days before", value: "3_days_before" });
      options.push({ label: "1 week before", value: "1_week_before" });
    } else if (currentBillingCycle === "Yearly") {
      options.push({ label: "1 day before", value: "1_day_before" });
      options.push({ label: "1 week before", value: "1_week_before" });
      options.push({ label: "2 weeks before", value: "2_weeks_before" });
      options.push({ label: "1 month before", value: "1_month_before" });
    }
    return options;
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
            { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {isEditMode ? "Edit" : "Add"} Subscription
            </Text>
            <Text style={styles.subtitle}>
              {isEditMode ? "Update" : "Enter"} the details of your subscription
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
              placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
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
              {!isEditMode && (
                <Text style={styles.autoFilledNote}>
                  (Auto-filled with today)
                </Text>
              )}
            </Text>
            <DatePicker
              value={subscriptionDate}
              onChange={setSubscriptionDate}
            />
          </View>

          <View style={styles.formGroup}>
            <CustomEnumPicker
              label="Billing Cycle"
              items={[
                { label: "Daily", value: "Daily" },
                { label: "Monthly", value: "Monthly" },
                { label: "Yearly", value: "Yearly" },
              ]}
              selectedValue={billing}
              onValueChange={handleBillingChange}
              placeholder="Select billing cycle"
              colors={colors}
              isRequired={true}
              errorText={touched.billing && errors.billing ? errors.billing : undefined}
            />
          </View>

          <View style={styles.formGroup}>
            <CustomEnumPicker
              label="Category (Optional)"
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
              selectedValue={category}
              onValueChange={setCategory}
              placeholder="Select a category"
              colors={colors}
            />
          </View>

          {/* Reminder Picker */}
          <View style={styles.formGroup}>
            <CustomEnumPicker
              label="Reminder Notification"
              items={getReminderOptions(billing)}
              selectedValue={reminder}
              onValueChange={setReminder}
              placeholder="Select a reminder preference"
              colors={colors}
              // isRequired={false} // Reminder is optional
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Icon (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.iconScrollView}
            >
              <View style={styles.iconPickerContainer}>
                {VALID_ICONS.map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.iconOption,
                      icon === iconName && styles.selectedIconOption,
                    ]}
                    onPress={() => setIcon(iconName)}
                  >
                    <Ionicons
                      name={
                        icon === iconName
                          ? (iconName.replace("-outline", "") as any)
                          : iconName
                      }
                      size={24}
                      color={
                        icon === iconName
                          ? AppSpecificColors.pureWhite
                          : colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Custom Image (Optional)</Text>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePickerButton}
            >
              <Text style={styles.imagePickerButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {customImageUri && (
              <Image
                source={{ uri: customImageUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
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
              <Text style={styles.saveButtonText}>
                {isEditMode ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

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
                    style={[
                      styles.modalHeaderButton,
                      { color: colors.primary },
                    ]}
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

