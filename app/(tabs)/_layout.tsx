import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, usePathname } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import FloatingAddButton from "../../components/FloatingAddButton";
import { BlurView } from "expo-blur";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
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
          tabBarBackground: () => (
            <BlurView
              tint="dark"
              intensity={50}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[styles.tabButton, focused && styles.tabButtonActive]}
              >
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
              <View
                style={[styles.tabButton, focused && styles.tabButtonActive]}
              >
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
              <View
                style={[styles.tabButton, focused && styles.tabButtonActive]}
              >
                <Ionicons
                  size={24}
                  name={focused ? "star" : "star-outline"}
                  color={focused ? "#FFFFFF" : "#66667A"}
                />
              </View>
            ),
          }}
        />
      </Tabs>
      {pathname === "/" && (
        <FloatingAddButton
          onPress={() =>
            router.push({ pathname: "/AddSubscription", params: { id: "" } })
          }
        />
      )}
    </View>
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
});
