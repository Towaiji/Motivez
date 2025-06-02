import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const navigation = useNavigation();
  const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 30) + 50 : 30;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: TOP_SPACE }]}>
      <Text style={styles.header}>Welcome to Motivez!</Text>
      <Text style={styles.subtext}>What do you feel like doing today?</Text>

      <View style={styles.swiperContainer}>
        <DeckSwiper />
      </View>
    </SafeAreaView>
  );
}
  
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  swiperContainer: {
    flex: 0.5,
    width: "100%",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});
