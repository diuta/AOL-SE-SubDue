import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useNavigation, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050511",
          height: 70,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: () => (
            <Ionicons size={28} name="home-outline" color={"#fff"} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddSubscription"
        options={{
          title: "",
          tabBarIcon: () => (
            <Ionicons size={28} name="add-outline" color={"#4649E5"} />
          ),
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
