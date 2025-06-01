import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CarouselRow from "../../components/CarouselRow";
import { useRouter } from "expo-router";

// 🔹 Dummy motives for FlatList (bottom)
const dummyMotives = [
  {
    id: "1",
    user: "@sara",
    title: "Late night go-karting 🏎️🔥",
    image: "https://picsum.photos/id/237/300/200",
    type: "close-friends",
  },
  {
    id: "2",
    user: "@jay",
    title: "Spontaneous beach day ☀️",
    image: "https://picsum.photos/id/1018/300/200",
    type: "public",
  },
  {
    id: "3",
    user: "@lee",
    title: "Board game night with the crew 🎲",
    image: "https://picsum.photos/id/1025/300/200",
    type: "featured",
  },
];

// 🔹 Mock data for carousels
const popularActivities = [
  { id: "1", title: "Go Karting", description: "4.8 ⭐️ · 2.1km", image: "https://i.imgur.com/UYiroysl.jpg" },
  { id: "2", title: "Karaoke Night", description: "4.5 ⭐️ · 3.7km", image: "https://i.imgur.com/UPrs1EWl.jpg" },
];

const festivalActivities = [
  { id: "3", title: "Lantern Fest", description: "5.0 ⭐️ · 1.2km", image: "https://i.imgur.com/MABUbpDl.jpg" },
  { id: "4", title: "Food Street", description: "4.6 ⭐️ · 3.2km", image: "https://i.imgur.com/KZsmUi2l.jpg" },
];

const sportActivities = [
  { id: "5", title: "Pickup Soccer", description: "4.2 ⭐️ · 1.8km", image: "https://i.imgur.com/2nCt3Sbl.jpg" },
  { id: "6", title: "Basketball Run", description: "4.9 ⭐️ · 2.5km", image: "https://i.imgur.com/lceHsT6l.jpg" },
];

export default function Motives() {
  const [selected, setSelected] = useState<"close-friends" | "featured" | "public">("public");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredMotives = dummyMotives.filter(
    (motive) => motive.type === selected
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Page Title */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Search</Text>

        <TouchableOpacity
          onPress={() => router.push("../maps/_index")}
          style={styles.mapButton}
        >
          <Ionicons name="map-outline" size={24} color="#e91e63" />
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search motives..."
          placeholderTextColor="#999"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 🎯 Filter Buttons */}
      <View style={styles.toggleContainer}>
        {["close-friends", "featured", "public"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.toggleButton, selected === type && styles.activeButton]}
            onPress={() => setSelected(type as typeof selected)}
          >
            <Text style={[styles.toggleText, selected === type && styles.activeText]}>
              {type === "close-friends" ? "Close Friends" : type === "featured" ? "Featured" : "Public"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🗂️ Motives List */}
      <FlatList
        data={[
          { id: "popular", title: "What's Popular in the Area", data: popularActivities },
          { id: "festival", title: "Festival Themed", data: festivalActivities },
          { id: "sport", title: "Sport Themed", data: sportActivities },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarouselRow title={item.title} data={item.data} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 60,
  },
  headerRow: {
  flexDirection: "row", // 🟢 makes it horizontal
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 70,
  marginBottom: 10,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginTop: -55,
  },
  searchBar: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  toggleButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#e91e63",
  },
  toggleText: {
    color: "#444",
    fontWeight: "500",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
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
  mapButton: {
  backgroundColor: "#fff",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  marginTop: -55,
  marginRight: -30,
},
});
