import { Text, View, StyleSheet, Image, FlatList, Dimensions } from "react-native";

const dummyPhotos = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/200?random=${i + 1}`);

export default function UserScreen() {
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
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Moments</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>102</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>80</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Memories Grid */}
      <FlatList
        data={dummyPhotos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.gridImage} />
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
  header: {
    flexDirection: "row",
    marginTop: 40,
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
  grid: {
    gap: 2,
  },
  gridImage: {
    width: Dimensions.get("window").width / 3 - 13,
    height: Dimensions.get("window").width / 3 - 4,
    margin: 1,
    borderRadius: 5,
  },
});
