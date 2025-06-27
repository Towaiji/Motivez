import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabaseClient";

export default function SignUpScreen() {
  const [name, setName] = useState(""); // Added name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      setLoading(false);
      Alert.alert("Sign Up Failed", error.message);
      return;
    }
    // Insert into profiles table with id = user.id
    const userId = data?.user?.id;
    if (!userId) {
      setLoading(false);
      Alert.alert("Sign Up Failed", "Could not get user ID.");
      return;
    }
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, email, name }]);
    setLoading(false);
    if (profileError) {
      Alert.alert(
        "Profile Creation Failed",
        "Account created, but failed to save profile. Please contact support."
      );
      return;
    }
    Alert.alert(
      "Sign Up Successful",
      "Account created"
    );
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Sign Up for Motivez</Text>
          <Text style={styles.subtitle}>Create your account</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
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
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 18 }}
              onPress={() => router.replace("/login")}
            >
              <Text style={{ color: "#e91e63", fontWeight: "500" }}>
                Already have an account? Sign In
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
