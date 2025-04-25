import { Text, View, StyleSheet, FlatList, Image } from "react-native";

const dummyMotives = [
  {
    id: "1",
    user: "@sara",
    title: "Late night go-karting 🏎️🔥",
    image: "https://picsum.photos/id/237/300/200",
  },
  {
    id: "2",
    user: "@jay",
    title: "Spontaneous beach day ☀️",
    image: "https://picsum.photos/id/1018/300/200",
  },
  {
    id: "3",
    user: "@lee",
    title: "Board game night with the crew 🎲",
    image: "https://picsum.photos/id/1025/300/200",
  },
];

export default function Motives() {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyMotives}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.user}>{item.user}</Text>
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
    paddingTop: 60,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  user: {
    fontSize: 14,
    color: "#666",
  },
});
