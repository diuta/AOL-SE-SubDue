import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
}: DatePickerProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  const handleDone = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShowPicker(false);
  };

  // The date picker button that's consistent across platforms
  const DatePickerButton = () => (
    <TouchableOpacity
      style={[styles.inputContainer, { borderColor: colors.cardBorder }]}
      onPress={() => setShowPicker(true)}
    >
      <Ionicons
        name="calendar-outline"
        size={20}
        color={colors.text}
        style={styles.icon}
      />
      <Text style={[styles.dateText, { color: colors.text }]}>
        {formatDate(value)}
      </Text>
    </TouchableOpacity>
  );

  if (Platform.OS === "web") {
    // Web implementation
    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}
        <DatePickerButton />

        {showPicker && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showPicker}
            onRequestClose={handleCancel}
          >
            <View style={styles.webModalOverlay}>
              <View
                style={[
                  styles.webModalContent,
                  { backgroundColor: colors.background },
                ]}
              >
                <View
                  style={[
                    styles.webModalHeader,
                    { borderBottomColor: colors.cardBorder },
                  ]}
                >
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Select Date
                  </Text>
                  <TouchableOpacity onPress={handleDone}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.webDatePickerContainer}>
                  {Platform.OS === "web" && (
                    // @ts-ignore - Using DOM element directly for web
                    <input
                      type="date"
                      value={tempDate.toISOString().split("T")[0]}
                      onChange={(e) => {
                        if (e.target.value) {
                          setTempDate(new Date(e.target.value));
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        margin: "8px 0",
                        fontSize: 16,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 8,
                        backgroundColor: colors.card,
                        color: colors.text,
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }

  // Native implementation using DateTimePicker
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <DatePickerButton />

      {/* Date picker modal for iOS */}
      {Platform.OS === "ios" && showPicker && (
        <Modal animationType="slide" transparent={true} visible={showPicker}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text
                    style={[styles.modalHeaderButton, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.modalHeaderTitle, { color: colors.text }]}>
                  Select Date
                </Text>
                <TouchableOpacity onPress={handleDone}>
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

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setTempDate(selectedDate);
                    }
                  }}
                  textColor={colors.text}
                  themeVariant={colorScheme}
                  style={styles.iosDatePicker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Date picker for Android */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
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
    marginBottom: 10,
  },
  modalHeaderButton: {
    fontSize: 16,
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iosDatePicker: {
    width: "100%",
    height: 200,
  },
  // Web specific styles
  webModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
  webModalContent: {
    width: 300,
    maxWidth: "90%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  webModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  webDatePickerContainer: {
    width: "100%",
  },
});
