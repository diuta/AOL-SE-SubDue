import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import DatabaseService from "@/utils/DatabaseService";
import { formatCurrency, formatChartNumber } from "@/utils/formatUtils";

interface Subscription {
  id: string;
  appName: string;
  price: string;
  subscriptionDate: string;
  dueDate: string;
  billing: string;
  category?: string;
  icon?: string;
}

const screenWidth = Dimensions.get("window").width - 40;

export default function Analytics() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalMonthlySpending, setTotalMonthlySpending] = useState<number>(0);
  const [categorySpending, setCategorySpending] = useState<
    { name: string; value: number; color: string; legendFontColor: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Colors for different categories
  const categoryColors = {
    Entertainment: "#FF6384",
    Productivity: "#36A2EB",
    Utilities: "#FFCE56",
    "Social Media": "#4BC0C0",
    Gaming: "#9966FF",
    Education: "#FF9F40",
    "Health & Fitness": "#8AC926",
    Other: "#82C0CC",
    "Not categorized": "#CCCCCC",
  };

  // Load subscriptions from database
  useFocusEffect(
    React.useCallback(() => {
      loadSubscriptions();
    }, [])
  );

  const loadSubscriptions = async () => {
    try {
      const subscriptions = (
        await DatabaseService.getSubscriptions<Subscription>()
      ).filter((sub) => sub !== null && typeof sub === "object");
      setSubscriptions(subscriptions);
      calculateStats(subscriptions);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  // Calculate statistics from subscriptions
  const calculateStats = (subscriptions: Subscription[]) => {
    if (subscriptions.length === 0) {
      console.log('No subscriptions found');
      setTotalMonthlySpending(0);
      setCategorySpending([]);
      return;
    }

    // Calculate total monthly spending
    let monthlyTotal = 0;
    const categoriesMap = new Map<string, number>();

    subscriptions.forEach((sub) => {
      const price = parseFloat(sub.price);
      if (isNaN(price)) {
        console.log('Invalid price found for subscription:', sub);
        return;
      }

      // Convert all prices to monthly
      let monthlyPrice = price;
      if (sub.billing === "Daily") {
        monthlyPrice = price * 30; // Approximate for a month
      } else if (sub.billing === "Yearly") {
        monthlyPrice = price / 12;
      }

      monthlyTotal += monthlyPrice;

      // Group spending by category
      const category = sub.category || "Not categorized";
      const current = categoriesMap.get(category) || 0;
      categoriesMap.set(category, current + monthlyPrice);
    });

    setTotalMonthlySpending(monthlyTotal);

    // Create data for pie chart
    const categoryData = Array.from(categoriesMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
        color: categoryColors[name as keyof typeof categoryColors] || "#CCCCCC",
        legendFontColor: "#FFFFFF",
        strokeWidth: 2,
        strokeColor: "#000000",
      })
    );

    setCategorySpending(categoryData);
  };

  // Generate projection data for next 12 months
  const generateProjectionData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Initialize arrays for chart
    const labels = [];
    const monthlyData = new Array(12).fill(0);

    // Calculate labels for next 12 months
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      labels.push(months[monthIndex]);
    }

    // Calculate monthly projections based on each subscription
    subscriptions.forEach((sub) => {
      const price = parseFloat(sub.price);
      if (isNaN(price)) return;

      // Handle different billing cycles
      switch (sub.billing) {
        case "Daily":
          // For daily, spread the monthly equivalent across all months
          const dailyMonthly = price * 30;
          for (let i = 0; i < 12; i++) {
            monthlyData[i] += dailyMonthly;
          }
          break;

        case "Monthly":
          // For monthly, add to each month
          for (let i = 0; i < 12; i++) {
            monthlyData[i] += price;
          }
          break;

        case "Yearly":
          // For yearly, only add to the month when payment is due
          // Parse the subscription date to determine when the yearly payment happens
          try {
            const dueDateParts = sub.dueDate.split(" ");
            if (dueDateParts.length >= 2) {
              const dueMonth = months.findIndex((m) =>
                dueDateParts[1].toLowerCase().startsWith(m.toLowerCase())
              );

              if (dueMonth !== -1) {
                for (let i = 0; i < 12; i++) {
                  const projectedMonth = (currentMonth + i) % 12;
                  if (projectedMonth === dueMonth) {
                    monthlyData[i] += price;
                    break; // Only add once in the 12-month period
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error parsing due date:", error);
          }
          break;
      }
    });

    // Calculate cumulative spending (running total)
    const cumulativeData = [];
    let runningTotal = 0;

    for (const monthAmount of monthlyData) {
      runningTotal += monthAmount;
      cumulativeData.push(runningTotal);
    }

    return {
      labels,
      datasets: [
        {
          data: monthlyData,
          color: (opacity = 1) => `rgba(70, 73, 229, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      cumulativeData,
    };
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Monthly Spending</Text>
        <Text style={styles.statsValue}>
          {formatCurrency(totalMonthlySpending)}
        </Text>
        <Text style={styles.statsSubtitle}>
          {subscriptions.length} active{" "}
          {subscriptions.length === 1 ? "subscription" : "subscriptions"}
        </Text>
      </View>

      {subscriptions.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {categorySpending.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={categorySpending}
                width={screenWidth}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  backgroundColor: "#1A1A2E",
                  backgroundGradientFrom: "#1A1A2E",
                  backgroundGradientTo: "#1A1A2E",
                  decimalPlaces: 0,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="5"
                absolute
                hasLegend={false}
                style={{
                  borderWidth: 2,
                  borderColor: "#000000",
                  marginVertical: 8,
                }}
              />

              <View style={styles.categoryLegend}>
                {categorySpending.map((category, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: category.color },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {category.name} (
                      {((category.value / totalMonthlySpending) * 100).toFixed(
                        0
                      )}
                      %):{" "}
                      <Text style={{ color: "#00C853" }}>
                        {formatChartNumber(category.value, true)}
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No category data available</Text>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={60} color="#4649E5" />
          <Text style={styles.emptyStateText}>No data to analyze</Text>
          <Text style={styles.emptyStateSubText}>
            Add subscriptions to see your analytics
          </Text>
        </View>
      )}
    </View>
  );

  const renderProjections = () => {
    const projectionData = generateProjectionData();

    return (
      <View style={styles.tabContent}>
        {subscriptions.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Monthly Spending</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: projectionData.labels,
                  datasets: projectionData.datasets,
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#1A1A2E",
                  backgroundGradientFrom: "#1A1A2E",
                  backgroundGradientTo: "#1A1A2E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#4649E5",
                  },
                  formatYLabel: (value) =>
                    formatChartNumber(parseInt(value), true),
                  count: 5,
                }}
                fromZero
                bezier={false}
                style={styles.chart}
                yLabelsOffset={10}
                withHorizontalLines={false}
                withVerticalLines={false}
              />
              <View style={styles.projectionDetails}>
                <Text style={styles.chartLabel}>
                  Monthly spending projection over the next year
                </Text>
                <Text style={styles.projectionValue}>
                  Average monthly:{" "}
                  {formatChartNumber(
                    projectionData.datasets[0].data.reduce((a, b) => a + b, 0) /
                      12,
                    true
                  )}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Cumulative Spending</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: projectionData.labels,
                  datasets: [
                    {
                      data: projectionData.cumulativeData,
                      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#1A1A2E",
                  backgroundGradientFrom: "#1A1A2E",
                  backgroundGradientTo: "#1A1A2E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#FF6384",
                  },
                  formatYLabel: (value) =>
                    formatChartNumber(parseInt(value), true),
                  count: 5,
                }}
                fromZero
                bezier
                style={styles.chart}
                yLabelsOffset={10}
                withHorizontalLines={false}
                withVerticalLines={false}
              />
              <View style={styles.projectionDetails}>
                <Text style={styles.chartLabel}>
                  Cumulative spending over time
                </Text>
                <Text style={styles.projectionValue}>
                  Total for 12 months:{" "}
                  {formatChartNumber(
                    projectionData.cumulativeData[
                      projectionData.cumulativeData.length - 1
                    ],
                    true
                  )}
                </Text>
              </View>
            </View>

            {/* Display monthly breakdown */}
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            <View style={styles.chartContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthlyBreakdownContainer}
              >
                {projectionData.labels.map((month, index) => (
                  <View key={index} style={styles.monthCard}>
                    <Text style={styles.monthName}>{month}</Text>
                    <Text style={styles.monthAmount}>
                      {formatChartNumber(
                        projectionData.datasets[0].data[index],
                        true
                      )}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={60} color="#4649E5" />
            <Text style={styles.emptyStateText}>No data to project</Text>
            <Text style={styles.emptyStateSubText}>
              Add subscriptions to see projections
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderCategoryBreakdown = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      {subscriptions.length > 0 && categorySpending.length > 0 ? (
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: categorySpending.map((cat) =>
                cat.name.length > 10
                  ? cat.name.substring(0, 10) + "..."
                  : cat.name
              ),
              datasets: [
                {
                  data: categorySpending.map((cat) => cat.value),
                },
              ],
            }}
            width={screenWidth}
            height={220}
            yAxisLabel="Rp. "
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#1A1A2E",
              backgroundGradientFrom: "#1A1A2E",
              backgroundGradientTo: "#1A1A2E",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(70, 73, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              formatYLabel: (value) => formatChartNumber(parseInt(value)),
              formatTopBarValue: (value) => formatChartNumber(value),
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />

          <View style={styles.categoryLegend}>
            {categorySpending.map((category, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {category.name}:{" "}
                  <Text style={{ color: "#00C853" }}>
                    {formatChartNumber(category.value, true)}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="pie-chart-outline" size={60} color="#4649E5" />
          <Text style={styles.emptyStateText}>No categories to analyze</Text>
          <Text style={styles.emptyStateSubText}>
            Add categorized subscriptions to see breakdown
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050511" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Analytics</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "projections" && styles.activeTab]}
          onPress={() => setActiveTab("projections")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "projections" && styles.activeTabText,
            ]}
          >
            Projections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "categories" && styles.activeTab]}
          onPress={() => setActiveTab("categories")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "categories" && styles.activeTabText,
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && renderOverview()}
        {activeTab === "projections" && renderProjections()}
        {activeTab === "categories" && renderCategoryBreakdown()}
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A2E",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    height: 48,
    justifyContent: "space-between",
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#2B2C4B",
  },
  tabText: {
    color: "#9D9DB5",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabContent: {
    marginTop: 10,
  },
  statsCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    color: "#9D9DB5",
    fontSize: 14,
    marginBottom: 8,
  },
  statsValue: {
    color: "#00C853",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsSubtitle: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  chartContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  categoryLegend: {
    marginTop: 16,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    marginVertical: 20,
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
  noDataText: {
    color: "#9D9DB5",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  projectionDetails: {
    width: "100%",
    marginTop: 12,
  },
  projectionValue: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
  monthlyBreakdownContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  monthCard: {
    backgroundColor: "#2B2C4B",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 6,
    minWidth: 100,
    alignItems: "center",
  },
  monthName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  monthAmount: {
    color: "#00C853",
    fontSize: 14,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00C853",
  },
});
