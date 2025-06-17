import React from 'react';
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollProvider } from "./context/ScrollContext";
import { ThemeProvider, useTheme } from './context/ThemeContext';

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeStatusBar />
        <ScrollProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            animation: 'none',
            presentation: 'card',
            contentStyle: {
              backgroundColor: 'transparent'
            }
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
          />
          <Stack.Screen 
            name="motive-detail" 
            options={{ 
              headerShown: false,
              presentation: 'modal', // Enable modal presentation
              animation: 'slide_from_bottom', // Bottom-to-top animation
              gestureEnabled: true, // Allow swipe down to dismiss
              gestureDirection: 'vertical',
            }} 
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              headerTitle: "Not Found",
              animation: 'none'
            }} 
          />
        </Stack>
        </ScrollProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Separate component to access theme inside provider
const ThemeStatusBar = () => {
  const { theme } = useTheme();
  return <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />;
};
