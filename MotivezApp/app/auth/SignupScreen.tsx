import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../_layout";

interface SignupScreenProps {
  onLogin: () => void;
}

export default function SignupScreen({ onLogin }: SignupScreenProps) {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== verifyPassword) {
      Alert.alert("Passwords do not match", "Please make sure both passwords match.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      Alert.alert("Sign Up Failed", error.message);
      return;
    }
    // Insert profile row
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert([
        { id: userId, name, email }
      ]);
      setLoading(false);
      if (profileError) {
        Alert.alert("Profile Error", profileError.message);
      } else {
        setUser(data.user);
      }
    } else {
      setLoading(false);
      Alert.alert("Sign Up Failed", "No user returned");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Motivez</Text>
      <Text style={styles.subtitle}>Create a Motivez account</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
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
      <Text style={styles.label}>Verify Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={verifyPassword}
        onChangeText={setVerifyPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.link}>Already have an account? Log In</Text>
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
