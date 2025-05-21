import { Text, View, StyleSheet, TouchableOpacity, } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MenuDrawer from "../../components/MenuDrawer";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setMenuVisible((prev) => !prev)}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 20,
        }}
      >
        <Ionicons name="person-circle-outline" size={40} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Welcome to Motivez!</Text>
      <Text style={styles.subtext}>What do you feel like doing today?</Text>

      <View style={styles.swiperContainer}>
        <DeckSwiper />
      </View>

      <MenuDrawer isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
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
});
