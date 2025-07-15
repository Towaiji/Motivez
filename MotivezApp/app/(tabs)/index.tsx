import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../lib/ThemeContext";
import { getColors } from "../../lib/colors";

export default function Home() {
  const navigation = useNavigation();
  const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 30) + 50 : 30;
  const { theme } = useTheme();
  const colors = getColors(theme);


  return (
    <SafeAreaView style={[styles.container, { paddingTop: TOP_SPACE, backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Discover</Text>
      <Text style={[styles.subtext, { color: colors.secondary }]}>Find your next adventure</Text>


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
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 60,
    marginTop: -27,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 60,
    marginTop: 5,
  },
  swiperContainer: {
    flex: 0.5,
    width: "100%",
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
});
