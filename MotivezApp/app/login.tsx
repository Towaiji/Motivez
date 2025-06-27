import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabaseClient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
      return;
    }
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    setLoading(false);
    if (profileError || !profile) {
      Alert.alert(
        "Login Failed",
        "No profile found for this account. Please sign up first."
      );
      await supabase.auth.signOut();
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Welcome to Motivez</Text>
          <Text style={styles.subtitle}>Create a Motivez Account</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>
            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e91e63", marginTop: 12 }]}
              onPress={() => router.push("/signup")}
              disabled={loading}
            >
              <Text style={[styles.loginButtonText, { color: "#e91e63" }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#e91e63",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ececec",
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});

