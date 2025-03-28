import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RedRose_400Regular, RedRose_700Bold, useFonts } from '@expo-google-fonts/red-rose';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RedRose_Regular: RedRose_400Regular,
    RedRose_Bold: RedRose_700Bold,  
  });
  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "SubDue",
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "bold", color: "#FFF", fontFamily: "RedRose_Bold",},
          headerStyle: { backgroundColor: "#050511",},
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({

});
