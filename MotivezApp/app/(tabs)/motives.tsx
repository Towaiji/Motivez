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
  NativeSyntheticEvent,
  Modal,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CarouselRow from "../../components/CarouselRow";
import { useRouter } from "expo-router";
import { useScroll } from "../context/ScrollContext";
import Slider from '@react-native-community/slider';
import { useTheme } from "../context/ThemeContext";

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
  { id: "1", title: "Go Karting", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/UYiroysl.jpg" },
  { id: "2", title: "Karaoke Night", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/UPrs1EWl.jpg" },
];

const festivalActivities = [
  { id: "3", title: "Lantern Fest", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/MABUbpDl.jpg" },
  { id: "4", title: "Food Street", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/KZsmUi2l.jpg" },
];

const sportActivities = [
  { id: "5", title: "Pickup Soccer", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/2nCt3Sbl.jpg" },
  { id: "6", title: "Basketball Run", description: "1.6 km · San Francisco, CA", image: "https://i.imgur.com/lceHsT6l.jpg" },
];

// Add suggested friends data
const suggestedFriends = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "https://i.imgur.com/UPrs1EWl.jpg",
    mutualFriends: 12,
  },
  {
    id: "2",
    name: "Sarah Miller",
    username: "@sarahm",
    avatar: "https://i.imgur.com/MABUbpDl.jpg",
    mutualFriends: 8,
  },
  {
    id: "3",
    name: "Mike Chen",
    username: "@mikec",
    avatar: "https://i.imgur.com/KZsmUi2l.jpg",
    mutualFriends: 15,
  },
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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    budget: "",
    distance: 8, // Changed from 5 miles to 8 km as default
    activityType: "",
  });
  const router = useRouter();
  const { scrollY } = useScroll();
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');
  const [distance, setDistance] = useState(8); // Changed from 5 miles to 8 km

  // Header animation values
  const headerScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 75, 150],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const headerCardTop = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -height * 0.07],
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
    const carouselData = [
      { id: "popular", title: "What's Popular in the Area", data: popularActivities },
      { id: "festival", title: "Festival Themed", data: festivalActivities },
      { id: "sport", title: "Sport Themed", data: sportActivities },
    ];

    switch(selected) {
      case "featured":
        return carouselData;
      case "public":
        return [
          
          ...carouselData
        ];
      case "close-friends":
        return [
          
          ...carouselData
        ];
      default:
        return carouselData;
    }
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

  const handleAcceptFriend = (id: string) => {
    console.log('Accept friend:', id);
  };

  const handleRejectFriend = (id: string) => {
    console.log('Reject friend:', id);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    setIsFilterModalVisible(false);
  };

  const renderSuggestedFriends = () => {
    return (
      <View style={styles.suggestedFriendsContainer}>
        <Text style={styles.suggestedFriendsTitle}>Suggested Friends</Text>
        {suggestedFriends.map((friend) => (
          <View key={friend.id} style={styles.suggestedFriendCard}>
            <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendUsername}>{friend.username}</Text>
              <Text style={styles.mutualFriends}>{friend.mutualFriends} mutual friends</Text>
            </View>
            <View style={styles.friendActions}>
              <TouchableOpacity 
                style={[styles.friendButton, styles.acceptButton]}
                onPress={() => handleAcceptFriend(friend.id)}
              >
                <Ionicons name="checkmark" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.friendButton, styles.rejectButton]}
                onPress={() => handleRejectFriend(friend.id)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Motives</Text>
              <TouchableOpacity 
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Distance Slider */}
            <View style={styles.filterSection}>
              <View style={styles.distanceHeader}>
                <Text style={styles.filterLabel}>Distance</Text>
                <Text style={styles.distanceValue}>{filters.distance} km</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={40}
                step={1}
                value={filters.distance}
                onValueChange={(value) => handleFilterChange('distance', value)}
                minimumTrackTintColor="#e91e63"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#e91e63"
              />
              <View style={styles.distanceMarkers}>
                <Text style={styles.markerText}>1 km</Text>
                <Text style={styles.markerText}>8 km</Text>
                <Text style={styles.markerText}>16 km</Text>
                <Text style={styles.markerText}>24 km</Text>
                <Text style={styles.markerText}>32 km</Text>
                <Text style={styles.markerText}>40 km</Text>
              </View>
            </View>

            {/* Budget Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Budget</Text>
              <View style={styles.filterOptions}>
                {['$', '$$', '$$$', '$$$$'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      filters.budget === option && styles.filterOptionSelected
                    ]}
                    onPress={() => handleFilterChange('budget', option)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.budget === option && styles.filterOptionTextSelected
                    ]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Activity Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Activity Type</Text>
              <View style={styles.filterOptions}>
                {['Outdoor', 'Indoor', 'Sports', 'Food', 'Entertainment'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      filters.activityType === option && styles.filterOptionSelected
                    ]}
                    onPress={() => handleFilterChange('activityType', option)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.activityType === option && styles.filterOptionTextSelected
                    ]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
      <Animated.View style={[
        styles.headerCard,
        {
          transform: [
            { translateY: headerCardTop },
            { scaleY: headerScale }
          ]
        }
      ]}>
        {/* Animated Content - Fades out when scrolling */}
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
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
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setIsFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={20} color="#666" />
            </TouchableOpacity>
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: height * 0.3, paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: true,
            listener: handleScroll
          }
        )}
        scrollEventThrottle={16}
      >
        {getTabData().map((item) => {
          if (isCarouselItem(item)) {
            return <CarouselRow key={item.id} title={item.title} data={item.data} />;
          } else if (isTitleItem(item)) {
            return (
              <View key={item.id} style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
              </View>
            );
          }
          return null;
        })}
        {renderSuggestedFriends()}
      </Animated.ScrollView>
      {renderFilterModal()}
    </SafeAreaView>
  );
}

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode ? '#000' : '#f4f6f8',
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
    backgroundColor: 'transparent',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: darkMode ? '#fff' : '#000',
    paddingHorizontal: 10,
  },
  searchBar: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: darkMode ? '#181818' : '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16,
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: darkMode ? '#eee' : '#333',
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
    color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    fontWeight: "500",
    fontSize: 14,
  },
  activeText: {
    color: darkMode ? '#fff' : '#000',
    fontWeight: "600",
  },
  card: {
    marginBottom: 20,
    backgroundColor: darkMode ? '#181818' : '#fff',
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
    color: darkMode ? '#aaa' : '#666',
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
    backgroundColor: darkMode ? '#1a1a1a' : '#efe7ee',
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
    height: height * 0.28,
    backgroundColor: darkMode ? '#181818' : '#fff',
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
  headerContent: {
    flex: 1,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: darkMode ? '#eee' : '#333',
    textAlign: "center",
  },
  suggestedFriendsContainer: {
    padding: 20,
    marginTop: 20,
  },
  suggestedFriendsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: darkMode ? '#eee' : '#333',
  },
  suggestedFriendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkMode ? '#181818' : '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: darkMode ? '#eee' : '#333',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
    color: darkMode ? '#aaa' : '#666',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 13,
    color: darkMode ? '#bbb' : '#888',
    fontWeight: '500',
  },
  friendActions: {
    flexDirection: 'row',
    gap: 10,
  },
  friendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF5252',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: darkMode ? '#181818' : '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: darkMode ? '#000' : '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkMode ? '#eee' : '#333',
  },
  closeButton: {
    padding: 5,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: darkMode ? '#eee' : '#333',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: darkMode ? '#333' : '#f1f1f1',
    borderWidth: 1,
    borderColor: darkMode ? '#444' : '#ddd',
  },
  filterOptionSelected: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  filterOptionText: {
    color: darkMode ? '#ccc' : '#666',
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#e91e63',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e91e63',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  distanceMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  markerText: {
    fontSize: 12,
    color: darkMode ? '#aaa' : '#666',
  },
});