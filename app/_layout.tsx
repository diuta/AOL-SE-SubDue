import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import {
  RedRose_400Regular,
  RedRose_700Bold,
  useFonts,
} from "@expo-google-fonts/red-rose";
import * as Notifications from "expo-notifications";
import { setupNotificationResponseListener } from "@/utils/NotificationService";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RedRose_Regular: RedRose_400Regular,
    RedRose_Bold: RedRose_700Bold,
  });
  const router = useRouter();

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    const unsubscribe = setupNotificationResponseListener(router);
    return () => {
      unsubscribe();
    };
  }, [router]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "SubDue",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#FFF",
            fontFamily: "RedRose_Bold",
          },
          headerStyle: { backgroundColor: "#050511" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050511",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "RedRose_Regular",
  },
});
