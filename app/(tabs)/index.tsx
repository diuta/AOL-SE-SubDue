import RemoveSubscriptionButton from "@/components/RemoveSubscriptionButton";
import EditSubscriptionButton from "@/components/EditSubscriptionButton";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatabaseService from "@/utils/DatabaseService";
import { formatCurrency } from "@/utils/formatUtils";
import { defaultImages } from "@/constants/ImageConstants";
import { VALID_ICONS, type IconName } from "@/constants/IconConstants";
import { LinearGradient } from 'expo-linear-gradient';
import { parse, differenceInDays, formatDistanceToNowStrict } from 'date-fns';

interface Subscription {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
  category?: string;
  icon?: IconName;
  customImage?: string;
  reminder?: string;
}

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth * 0.12;
const iconBorderRadius = iconSize * 0.167;
const iconMarginRight = screenWidth * 0.035;

// Define Tab Bar Height for padding
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 72;

// Helper function to get days until due - updated to return JSX
const getDaysUntilDue = (dueDateString: string): React.JSX.Element | string => {
  try {
    const dueDate = parse(dueDateString, 'dd MMMM yyyy', new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysDifference = differenceInDays(dueDate, today);

    if (daysDifference < 0) {
      const overdueDuration = formatDistanceToNowStrict(dueDate, { unit: 'day', addSuffix: false }).replace(' ago', '');
      return (
        <Text style={styles.detailTextStyle}>Overdue by <Text style={{ fontWeight: 'bold' }}>{overdueDuration}</Text></Text>
      );
    } else if (daysDifference === 0) {
      return <Text style={[styles.detailTextStyle, { fontWeight: 'bold' }]}>Due today</Text>;
    } else {
      return (
        <Text style={styles.detailTextStyle}>Due in <Text style={{ fontWeight: 'bold' }}>{daysDifference}</Text> day{daysDifference === 1 ? '' : 's'}</Text>
      );
    }
  } catch (error) {
    console.error("Error parsing due date:", dueDateString, error);
    return "Due date invalid";
  }
};

// Helper function to format reminder string - updated to remove prefix
const formatReminder = (reminderValue?: string): string | null => {
  if (!reminderValue || reminderValue === "none") return null;
  switch (reminderValue) {
    case "on_due_date":
      return "On due date";
    case "1_day_before":
      return "1 day before";
    case "3_days_before":
      return "3 days before";
    case "1_week_before":
      return "1 week before";
    case "2_weeks_before":
      return "2 weeks before";
    case "1_month_before":
      return "1 month before";
    default:
      return reminderValue.replace(/_/g, ' ');
  }
};

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const subscriptions =
        await DatabaseService.getSubscriptions<Subscription>();
      setSubscriptions(subscriptions);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, []),
  );

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050511" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Subscriptions</Text>
        {subscriptions.length > 0 && (
          <Text style={styles.subHeader}>
            {filteredSubscriptions.length} of {subscriptions.length} active{" "}
            {subscriptions.length === 1 ? "subscription" : "subscriptions"}
          </Text>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9D9DB5" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Subscriptions..."
          placeholderTextColor="#9D9DB5"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredSubscriptions.length === 0 && subscriptions.length > 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={60} color="#4649E5" />
            <Text style={styles.emptyStateText}>No subscriptions found</Text>
            <Text style={styles.emptyStateSubText}>
              Try a different search term.
            </Text>
          </View>
        ) : filteredSubscriptions.length === 0 && subscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#4649E5" />
            <Text style={styles.emptyStateText}>No subscriptions yet</Text>
            <Text style={styles.emptyStateSubText}>
              Add your first subscription to get started
            </Text>
          </View>
        ) : (
          filteredSubscriptions.map((subscription) => {
            let imageSource = null;
            if (subscription.customImage) {
              if (subscription.customImage.startsWith('file://') ||
                  subscription.customImage.startsWith('http://') ||
                  subscription.customImage.startsWith('https://') ||
                  subscription.customImage.startsWith('data:')) {
                imageSource = { uri: subscription.customImage };
              } else if (defaultImages[subscription.customImage]) {
                imageSource = defaultImages[subscription.customImage];
              }
            }

            console.log("Subscription item:", subscription);
            console.log("Determined imageSource:", imageSource);

            const daysUntilDueTextElement = getDaysUntilDue(subscription.dueDate);
            const reminderText = formatReminder(subscription.reminder);

            return (
            <LinearGradient
              key={subscription.id}
              colors={['#2E2E48', '#1C1C2E']}
              style={styles.subscriptionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                {/* Image Container and Reminder below it */}
                <View style={styles.imageAndReminderContainer}> 
                  <View style={styles.imageOuterContainer}>
                    {imageSource ? (
                      <Image
                        source={imageSource}
                        style={styles.primaryImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.primaryImagePlaceholder} />
                    )}
                  </View>
                  {reminderText && (
                    <View style={styles.reminderBelowIconContainer}>
                      <Ionicons name="notifications-outline" size={12} color="#9D9DB5" style={styles.detailIconStyle} />
                      <Text style={styles.reminderBelowIconText} numberOfLines={1} ellipsizeMode="tail">{reminderText}</Text>
                    </View>
                  )}
                </View>

                {/* Info Column (Name, Due, Category) */}
                <View style={styles.infoColumnStyle}>
                  <Text style={styles.appNameStyle} numberOfLines={1} ellipsizeMode="tail">{subscription.appName}</Text>
                  <View style={styles.detailRowStyle}>
                    <Ionicons name="calendar-outline" size={14} color="#9D9DB5" style={styles.detailIconStyle} />
                    {/* Render the JSX element directly */}
                    {daysUntilDueTextElement}
                  </View>
                  {subscription.category && (
                    <View style={styles.detailRowStyle}>
                      <Ionicons name="pricetag-outline" size={14} color="#9D9DB5" style={styles.detailIconStyle} />
                      <Text style={styles.detailTextStyle} numberOfLines={1} ellipsizeMode="tail">{subscription.category}</Text>
                    </View>
                  )}
                </View>

                {/* Price Column */}
                <View style={styles.priceColumnStyle}>
                  <Text style={styles.priceTextStyle}>{formatCurrency(parseFloat(subscription.price))}</Text>
                  <Text style={styles.billingCycleTextStyle}>/{subscription.billing}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                {/* Subscription Type Icon - Bottom Left */}
                {subscription.icon && (
                  <Ionicons
                    name={subscription.icon}
                    size={18}
                    color="#9D9DB5"
                    style={styles.subscriptionTypeIcon}
                  />
                )}

                {/* Container for right-aligned action buttons */}
                <View style={styles.actionButtonsContainer}>
                  <EditSubscriptionButton id={subscription.id} />
                  <RemoveSubscriptionButton
                    id={subscription.id}
                    onUpdate={loadSubscriptions}
                  />
                </View>
              </View>
            </LinearGradient>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050511",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subHeader: {
    color: "#9D9DB5",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateSubText: {
    color: "#9D9DB5",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  subscriptionCard: {
    borderRadius: 16,
    marginVertical: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4A5568",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  imageOuterContainer: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconBorderRadius,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: 'hidden',
  },
  imageAndReminderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: iconMarginRight,
  },
  primaryImage: {
    width: "100%",
    height: "100%",
    borderRadius: iconBorderRadius,
  },
  primaryImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: iconBorderRadius,
    backgroundColor: "#393A5A",
  },
  infoColumnStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginRight: 8,
  },
  appNameStyle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailRowStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  detailIconStyle: {
    marginRight: 5,
  },
  detailTextStyle: {
    color: "#9D9DB5",
    fontSize: 13,
  },
  priceColumnStyle: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
    flexShrink: 0,
  },
  priceTextStyle: {
    color: "#00C853",
    fontSize: 18,
    fontWeight: "bold",
  },
  billingCycleTextStyle: {
    color: "#9D9DB5",
    fontSize: 13,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subscriptionTypeIcon: {
    // Add any specific styling for the icon here if needed, e.g., marginRight
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginLeft: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  reminderBelowIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reminderBelowIconText: {
    color: "#9D9DB5",
    fontSize: 11,
    marginLeft: 3,
  },
});
