import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" />
        {/* Detail screen */}
        <Stack.Screen
          name="details/DetailScreen"
          options={{
            presentation: "modal", // optional: 'modal' or 'card'
            // You can add sharedElement options here if supported
          }}
        />
        {/* Not found fallback */}
        <Stack.Screen name="+not-found" options={{ headerTitle: "Not Found" }} />
      </Stack>
    </>
  );
}
