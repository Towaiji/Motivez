import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const createdMotives = [
  { id: "1", title: "Go-Kart Madness", date: "Apr 10", location: "SpeedZone" },
  { id: "2", title: "BBQ at Sunset", date: "Apr 5", location: "Trinity Bellwoods" },
];

const attendedMotives = [
  { id: "3", title: "SkyZone Trampoline Night", date: "Mar 28", location: "SkyZone" },
  { id: "4", title: "Sushi Buffet Run", date: "Mar 15", location: "Kaka Sushi" },
];

export default function UserScreen() {
  const handleCalendarPress = () => {
    // TODO: Navigate to calendar/upcoming screen
    console.log("Calendar pressed");
  };

  const handleSettingsPress = () => {
    // TODO: Open settings modal or screen
    console.log("Settings pressed");
  };

  return (
    <View style={styles.container}>
      

      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.username}>@motive_user</Text>
          <Text style={styles.bio}>Exploring new places, one motive at a time 🌍</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>{createdMotives.length}</Text>
          <Text style={styles.statLabel}>Motives Created</Text>
        </View>
      </View>

      {/* My Motives */}
      <Text style={styles.sectionTitle}>My Motives</Text>
      <FlatList
        data={createdMotives}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.motiveCard}>
            <Text style={styles.motiveTitle}>{item.title}</Text>
            <Text style={styles.motiveMeta}>
              {item.location} • {item.date}
            </Text>
          </View>
        )}
      />

      {/* History */}
      <Text style={styles.sectionTitle}>History</Text>
      <FlatList
        data={attendedMotives}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.motiveCard}>
            <Text style={styles.motiveTitle}>{item.title}</Text>
            <Text style={styles.motiveMeta}>
              {item.location} • {item.date}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efe7ee",
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 10,
  },
  header: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: "#555",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statBlock: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 8,
    color: "#444",
  },
  motiveCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  motiveTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  motiveMeta: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});
