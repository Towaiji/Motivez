import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CarouselRow from "../../components/CarouselRow";
import { useRouter } from "expo-router";
import { useScroll } from "../context/ScrollContext";

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

const { height, width } = Dimensions.get("window");

//Define the Motives component
type TabItem = {
  id: string;
  type: "tabs";
};

type CarouselItem = {
  id: string;
  title: string;
  data: { id: string; title: string; description: string; image: string }[];
};

type TitleItem = {
  id: string;
  type: "title";
  title: string;
};

type Item = TabItem | CarouselItem | TitleItem;

export default function Motives() {
  const [selected, setSelected] = useState<"public" | "featured" | "close-friends">("featured");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');

  // Header animation values with slower timing
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [height * 0.28, height * 0.14],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 75, 150],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1], // Keep title visible
    extrapolate: 'clamp',
  });

  const mapButtonOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1], // Keep map button visible
    extrapolate: 'clamp',
  });

  const filteredMotives = dummyMotives.filter(
    (motive) => motive.type === selected
  );

  // Get data based on selected tab
  const getTabData = (): Item[] => {
    return [
      { id: "popular", title: "What's Popular in the Area", data: popularActivities },
      { id: "festival", title: "Festival Themed", data: festivalActivities },
      { id: "sport", title: "Sport Themed", data: sportActivities },
    ];
  };

  // Type guard to detect TabItem
  function isTabItem(item: Item): item is TabItem {
    return (item as TabItem).type === "tabs";
  }

  function isCarouselItem(item: Item): item is CarouselItem {
    return (item as CarouselItem).data !== undefined && (item as CarouselItem).title !== undefined;
  }

  function isTitleItem(item: Item): item is TitleItem {
    return (item as TitleItem).type === "title";
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > lastScrollY.current) {
      scrollDirection.current = 'down';
    } else {
      scrollDirection.current = 'up';
    }
    
    lastScrollY.current = currentScrollY;
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Fixed Header Elements */}
      <View style={styles.fixedHeader}>
        <Text style={styles.pageTitle}>Search</Text>
        <TouchableOpacity
          onPress={() => router.push("../maps/_index")}
          style={styles.mapButton}
        >
          <Ionicons name="map-outline" size={24} color="#e91e63" />
        </TouchableOpacity>
      </View>

      {/* Animated Header */}
      <Animated.View style={[styles.headerCard, { height: headerHeight }]}>
        {/* Animated Content - Fades out when scrolling */}
        <Animated.View style={{ opacity: headerOpacity }}>
          {/* Search Bar */}
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

          {/* Tabs - Updated order: public, featured, close-friends */}
          <View style={styles.toggleContainer}>
            {["public", "featured", "close-friends"].map((type) => {
              const isActive = selected === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelected(type as typeof selected)}
                  style={styles.toggleButton}
                  activeOpacity={0.7}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text style={[styles.toggleText, isActive && styles.activeText]}>
                      {type === "close-friends"
                        ? "Close Friends"
                        : type === "featured"
                        ? "Featured"
                        : "Public"}
                    </Text>
                    {isActive && <View style={styles.activeIndicator} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>

      {/* Scrollable content */}
      <Animated.FlatList
        data={getTabData()}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: height * 0.3, paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: false,
            listener: handleScroll
          }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          if (isCarouselItem(item)) {
            return <CarouselRow title={item.title} data={item.data} />;
          } else if (isTitleItem(item)) {
            return (
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
              </View>
            );
          }
          return null;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    paddingTop: 60,
    zIndex: 20,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 10,
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
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#e91e63",
  },
  toggleText: {
    color: "rgba(0,0,0,0.5)",
    fontWeight: "500",
    fontSize: 14,
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stickyTabsContainer: {
    backgroundColor: "#efe7ee",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    zIndex: 10,
  },
  activeIndicator: {
    marginTop: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e91e63",
  },
  headerCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 100,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
