import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050511",
          height: Platform.OS === "ios" ? 88 : 72,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 30 : 16,
          paddingHorizontal: 30,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#66667A",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                size={24}
                name={focused ? "home" : "home-outline"}
                color={focused ? "#FFFFFF" : "#66667A"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                size={24}
                name={focused ? "analytics" : "analytics-outline"}
                color={focused ? "#FFFFFF" : "#66667A"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Recommendations"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                size={24}
                name={focused ? "star" : "star-outline"}
                color={focused ? "#FFFFFF" : "#66667A"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="AddSubscription"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push({
              pathname: "/AddSubscription",
              params: { id: "" },
            });
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabButton,
                styles.addButton,
                focused && styles.addButtonActive,
              ]}
            >
              <Ionicons size={24} name="add" color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                size={24}
                name={focused ? "settings" : "settings-outline"}
                color={focused ? "#FFFFFF" : "#66667A"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    width: 56,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#2B2C4B",
  },
  addButton: {
    backgroundColor: "#4649E5",
    shadowColor: "#4649E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonActive: {
    backgroundColor: "#5558FF",
    shadowOpacity: 0.5,
  },
});
