import React, { useEffect } from 'react';
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollProvider } from "./context/ScrollContext";
import { supabase } from '../lib/supabaseClient';
import { ThemeProvider } from '../lib/ThemeContext';


LogBox.ignoreAllLogs(true);

export default function RootLayout() {

  useEffect(() => {
    const login = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
  
      if (!session) {
        const { error } = await supabase.auth.signInWithPassword({
          email: "test@motivez.com",
          password: "test123",
        });
  
        if (error) console.error("❌ Dev login failed:", error.message);
        else console.log("✅ Test user logged in");
      } else {
        console.log("✅ Session already active for test user");
      }
    };
  
    login();
  }, []);
  
  

  return (
    <ThemeProvider>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
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
    </SafeAreaProvider>
    </ThemeProvider>
  );
}