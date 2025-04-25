import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const activities = [
  "Go Karting",
  "Bowling",
  "Arcade",
  "Mini Golf",
  "Escape Room",
  "Cinema",
  "Hiking",
  "Beach",
  "Board Games",
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Motivez!</Text>
      <Text style={styles.subtext}>What do you feel like doing today?</Text>

      <ScrollView contentContainerStyle={styles.bubbleContainer}>
        {activities.map((activity, index) => (
          <TouchableOpacity key={index} style={styles.bubble}>
            <Text style={styles.bubbleText}>{activity}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#efe7ee",
    alignItems: "center",
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
  bubbleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  bubble: {
    backgroundColor: "#e91e63",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 8,
    elevation: 3,
  },
  bubbleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
