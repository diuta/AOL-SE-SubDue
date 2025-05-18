import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, AppSpecificColors } from "@/constants/Colors"; // Assuming this path is correct relative to components dir

export type PickerItem = { label: string; value: string };

export type CustomEnumPickerProps = {
  label: string;
  items: PickerItem[];
  selectedValue: string | null | undefined;
  onValueChange: (value: string) => void;
  placeholder: string;
  colors: typeof Colors.light;
  errorText?: string;
  isRequired?: boolean;
};

const makeStyles = (colors: typeof Colors.light, platformOS: typeof Platform.OS) =>
  StyleSheet.create({
    formGroup: { // Re-using similar structure for consistency if needed elsewhere
      marginBottom: 20, // Matches AddSubscription formGroup margin if this picker is used outside a formGroup
    },
    labelContainer: {
      flexDirection: "row",
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    requiredIndicator: {
      color: colors.danger,
      marginLeft: 4,
    },
    pickerTouchable: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 16,
      height: 56, // Consistent height
    },
    pickerTouchableError: {
      borderColor: colors.danger,
    },
    pickerText: {
      fontSize: 16,
      color: colors.text,
    },
    placeholderText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    chevronIcon: {
      marginLeft: 8,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
    },
    // Modal Styles
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalView: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingTop: 8, // Reduced top padding
      paddingBottom: platformOS === 'ios' ? 30 : 20, // SafeArea for bottom
      maxHeight: "70%", // Limit modal height
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
          // To ensure border-radius is respected with boxShadow on web:
          borderWidth: 1, // Or a very small value like 0.1 if no border is desired
          borderColor: 'transparent', // Match background or make transparent
        }
      })),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12, // Adjusted padding
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
    },
    modalHeaderTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    modalCloseButtonText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "500",
    },
    modalScrollView: {
      marginTop: 8,
    },
    modalItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder, // Subtle separator
    },
    modalItemText: {
      fontSize: 16,
      color: colors.text,
    },
    modalItemSelectedText: {
      color: colors.primary,
      fontWeight: "600",
    },
    modalItemNoBorder: {
      borderBottomWidth: 0,
    }
  });

const CustomEnumPicker: React.FC<CustomEnumPickerProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder,
  colors,
  errorText,
  isRequired,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const styles = makeStyles(colors, Platform.OS);

  const selectedLabel = items.find((item) => item.value === selectedValue)?.label || placeholder;

  return (
    <View style={styles.formGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.requiredIndicator}>*</Text>}
      </View>
      <TouchableOpacity
        style={[
          styles.pickerTouchable,
          errorText ? styles.pickerTouchableError : null,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedValue ? styles.pickerText : styles.placeholderText}>
          {selectedLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.textSecondary}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.centeredView} 
          activeOpacity={1} 
          onPressOut={() => setModalVisible(false)} // Close by tapping outside modal content
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.modalView}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.modalItem,
                    index === items.length - 1 ? styles.modalItemNoBorder : null, // Remove border for last item
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.modalItemText,
                      item.value === selectedValue && styles.modalItemSelectedText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomEnumPicker; 