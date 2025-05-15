import { Text, View, StyleSheet } from "react-native";
import DeckSwiper from "../../components/DeckSwiper";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Motivez!</Text>
      <Text style={styles.subtext}>What do you feel like doing today?</Text>
      
      <View style={styles.swiperContainer}>
        <DeckSwiper />
      </View>
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
