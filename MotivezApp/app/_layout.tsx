import React from 'react';
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
          animation: 'none',
          presentation: 'transparentModal',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="motive-detail" 
          options={{ 
            headerShown: false,
            animation: 'none',
            presentation: 'transparentModal',
          }} 
        />
        <Stack.Screen name="+not-found" options={{ headerTitle: "Not Found" }} />
      </Stack>
    </>
  );
}
