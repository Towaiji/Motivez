import React, { useEffect, useState, createContext, useContext } from 'react';
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollProvider } from "./context/ScrollContext";
import { supabase } from '../lib/supabaseClient';
import { ThemeProvider } from '../lib/ThemeContext';
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';

LogBox.ignoreAllLogs(true);

// Auth context for global access
export const AuthContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  profile: any;
  setProfile: (profile: any) => void;
}>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  profile: null,
  setProfile: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!error) setProfile(data);
      else setProfile(null);
    };
    fetchProfile();
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthScreen('login');
  };

  if (loading) return null;

  return (
    <ThemeProvider>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthContext.Provider value={{ user, setUser, logout, profile, setProfile }}>
        {user ? (
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
        ) : (
          authScreen === 'login' ? (
            <LoginScreen onSignup={() => setAuthScreen('signup')} />
          ) : (
            <SignupScreen onLogin={() => setAuthScreen('login')} />
          )
        )}
      </AuthContext.Provider>
    </SafeAreaProvider>
    </ThemeProvider>
  );
}