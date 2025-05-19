import { Text, View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";

export default function Home() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={toggleMenu}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Motivez!</Text>
      <Text style={styles.subtext}>What do you feel like doing today?</Text>
      
      <View style={styles.swiperContainer}>
        <DeckSwiper />
      </View>
      {menuVisible && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.backdrop}>
            <Animated.View style={[styles.drawer, { left: slideAnim }]}>
              <Text style={styles.drawerItem}>Profile</Text>
              <Text style={styles.drawerItem}>Settings</Text>
              <Text style={styles.drawerItem}>Saved</Text>
              <Text style={styles.drawerItem}>Logout</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#efe7ee",
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
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },

  drawerItem: {
    fontSize: 18,
    marginBottom: 20,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});
