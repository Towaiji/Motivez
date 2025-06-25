import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const navigation = useNavigation();
  const { darkMode } = useTheme();
  const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 30) + 50 : 30;
  const styles = getStyles(darkMode);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: TOP_SPACE }]}>
      <Text style={styles.header}>Discover</Text>
      <Text style={styles.subtext}>Find your next adventure</Text>

      <View style={styles.swiperContainer}>
        <DeckSwiper />
      </View>
    </SafeAreaView>
  );
}
  
 

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 150,
      backgroundColor: darkMode ? '#000' : '#f4f6f8',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#000',
      alignSelf: 'flex-start',
      marginLeft: 60,
      marginTop: -15,
    },
    subtext: {
      fontSize: 16,
      color: darkMode ? '#aaa' : '#666',
      marginBottom: 20,
      alignSelf: 'flex-start',
      marginLeft: 60,
      marginTop: 5,
    },
    swiperContainer: {
      flex: 0.5,
      width: '100%',
      paddingBottom: 10,
      paddingHorizontal: 10,
      paddingTop: 40,
    },
  });
