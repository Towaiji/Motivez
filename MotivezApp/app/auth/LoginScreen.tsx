import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../_layout";

interface LoginScreenProps {
  onSignup: () => void;
}

export default function LoginScreen({ onSignup }: LoginScreenProps) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Enter your email first");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) Alert.alert("Error", error.message);
    else Alert.alert("Check your email for password reset instructions.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back to Motivez</Text>
      <Text style={styles.subtitle}>Log in to your Motivez account</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSignup}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  welcome: { fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 4, color: "#e91e63" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 16, color: "#e91e63" },
  label: { fontSize: 14, color: "#333", marginBottom: 4, marginLeft: 2 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#e91e63", padding: 16, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#e91e63", textAlign: "center", marginTop: 8 },
});

