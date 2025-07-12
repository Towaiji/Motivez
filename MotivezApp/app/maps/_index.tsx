import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Animated, ScrollView, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../../lib/supabaseClient'
import { fetchNearbyPlaces } from "@/lib/fetchNearbyPlaces";
import { fetchPlacesByTextSearch } from "@/lib/fetchNearbyPlaces";
import { useTheme } from "../../lib/ThemeContext";
import { getColors } from "../../lib/colors";

export default function MapScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);

  // Move StyleSheet.create to the very top of the function, before any usage
  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    safeArea: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 3,
    },
    topBar: {
      position: "absolute",
      top: 60,
      left: 20,
      right: 20,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 2,
      justifyContent: "space-between",
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.mapButtonBg,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      shadowColor: colors.mapButtonShadow,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    bottomPanelSafe: {
      position: "absolute",
      bottom: -35,
      left: 0,
      right: 0,
      zIndex: 10,
      alignItems: "center",
    },
    bottomPanel: {
      backgroundColor: colors.cardBg,
      width: "100%",
      paddingHorizontal: 20,
      paddingBottom: 5,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 12,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 20,
      marginTop: 10,
    },
    bottomSearchInput: {
      flex: 1,
      fontSize: 20,
      color: colors.text,
    },
    currentLocationButton: {
      position: "absolute",
      bottom: 135,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.mapButtonBg,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.mapButtonShadow,
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
    searchAreaButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primaryPink,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    searchAreaText: {
      color: colors.submitBtnText,
      fontSize: 16,
      fontWeight: "600",
    },
    searchButton: {
      marginLeft: 10,
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.primaryPink,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    exploreButton: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 20,
      marginBottom: 25,
      zIndex: 1,
    },
    exploreButtonText: {
      fontSize: 27,
      color: colors.text,
      fontWeight: "600",
    },
    fakeSearchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      padding: 14,
      marginTop: 10,
    },
    fakeSearchText: {
      fontSize: 16,
      color: colors.inputPlaceholder,
    },
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "transparent",
      zIndex: 15,
    },
    modalContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.modalBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
      zIndex: 20,
      height: "60%",
    },
    modalContent: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 15,
    },
    closeButton: {
      padding: 5,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    searchIcon: {
      marginRight: 10,
    },
    modalSearchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: colors.sectionTitle,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    categoryButton: {
      width: "48%",
      aspectRatio: 2.5,
      backgroundColor: colors.filterButtonBg,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      flexDirection: "column",
      elevation: 2,
      shadowColor: colors.filterButtonShadow,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      borderWidth: 1,
      borderColor: colors.inputBorder,
      position: "relative",
    },
    categoryButtonSelected: {
      backgroundColor: colors.filterOptionSelectedBg,
      borderColor: colors.filterOptionSelectedBorder,
    },
    categoryIcon: {
      marginBottom: 4,
    },
    categoryLabel: {
      fontSize: 12,
      marginTop: 4,
      textAlign: "center",
      color: colors.filterOptionText,
      fontWeight: "500",
    },
    categoryLabelSelected: {
      color: colors.filterOptionTextSelected,
      fontWeight: "600",
    },
    categoryScrollView: {
      flex: 1,
    },
    clearButton: {
      marginLeft: 8,
    },
    selectedIndicator: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.friendButtonAccept,
      justifyContent: "center",
      alignItems: "center",
    },
    activeCategoriesContainer: {
      position: "absolute",
      top: 120,
      left: 0,
      right: 0,
      zIndex: 2,
      paddingHorizontal: 20,
    },
    activeCategoriesScroll: {
      flexDirection: "row",
    },
    activeCategoryChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    activeCategoryIcon: {
      marginRight: 4,
    },
    activeCategoryLabel: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "500",
      marginRight: 4,
    },
    activeCategoryClose: {
      marginLeft: 2,
    },
    activeLabel: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginLeft: 10,
      marginTop: 130,
      alignItems: 'center',
      elevation: 3, // Android shadow
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    activeLabelText: {
      fontSize: 14,
      marginRight: 6,
      color: colors.text,
    },
    removeText: {
      fontSize: 14,
      color: colors.secondary,
    },
    searchPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    searchPillText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
      marginRight: 6,
    },
  });

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const mapRef = React.useRef<MapView>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [googlePlaces, setGooglePlaces] = useState<any[]>([]);
  const [mapRegion, setMapRegion] = useState(region);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryPlaces, setCategoryPlaces] = useState<{[key: string]: any[]}>({});
  const searchPanelAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [activeSearchLabel, setActiveSearchLabel] = useState<string | null>(null);


  const panelTranslateY = searchPanelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    // Debug log for API key
    console.log("Google Maps API Key:", process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
    console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
  }, []);

  const goToCurrentLocation = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(region, 300);
    }
  };

  const geocodeLocation = async (query: string) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log("Using API Key for geocoding:", apiKey); // Debug log
      
      if (!apiKey) {
        console.error("Google Maps API key is not set");
        return null;
      }
  
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
      );
      
      const data = await response.json();
      console.log("Geocoding response status:", data.status); // Debug log
  
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.warn("Geocoding failed:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
      return null;
    }
  };
  

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    setActiveSearchLabel(searchQuery);
    const lowerQuery = searchQuery.toLowerCase();
    const match = places.find((place) => {
      const name = place.name?.toLowerCase() || "";
      const category = place.category?.toLowerCase() || "";
      return name.includes(lowerQuery) || category.includes(lowerQuery);
    });
    if (match && mapRef.current) {
      const lat = Number(match.latitude);
      const lng = Number(match.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }, 300);
      }
    } else if (mapRegion) {
      const results = await fetchPlacesByTextSearch(searchQuery, mapRegion.latitude, mapRegion.longitude);
      if (results.length > 0) {
        setGooglePlaces(results);
        const first = results[0];
        const lat = first.geometry?.location?.lat;
        const lng = first.geometry?.location?.lng;
        if (mapRef.current && lat && lng) {
          mapRef.current.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }, 300);
        }
      }
    }
  };
  

  const handleCategoryToggle = async (categoryType: string) => {
    if (!mapRegion) return;

    if (selectedCategories.includes(categoryType)) {
      // Remove category
      setSelectedCategories(prev => prev.filter(cat => cat !== categoryType));
      setCategoryPlaces(prev => {
        const newPlaces = { ...prev };
        delete newPlaces[categoryType];
        return newPlaces;
      });
    } else {
      // Add category
      setSelectedCategories(prev => [...prev, categoryType]);
      
      // Fetch places for this category
      const results = await fetchNearbyPlaces(
        mapRegion.latitude,
        mapRegion.longitude,
        categoryType
      );
      
      setCategoryPlaces(prev => ({
        ...prev,
        [categoryType]: results
      }));
    }
  };

  // Get all places to display based on selected categories
  const getDisplayPlaces = () => {
    if (selectedCategories.length === 0) {
      return googlePlaces; // Show default places when no categories selected
    }
    
    const allCategoryPlaces = [];
    for (const category of selectedCategories) {
      if (categoryPlaces[category]) {
        allCategoryPlaces.push(...categoryPlaces[category]);
      }
    }
    return allCategoryPlaces;
  };
  

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        console.log("Fetching places...");
        const { data, error } = await supabase
          .from('places')
          .select('*');
      
        if (error) {
          console.error("Error fetching places:", error);
        } else {
          console.log("Places fetched successfully:", data?.length, "places");
          setPlaces(data || []);
        }
      } catch (error) {
        console.error("Error in fetchPlaces:", error);
      }
    };

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log("Location set:", location.coords);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });

        const googleResults = await fetchNearbyPlaces(
          location.coords.latitude,
          location.coords.longitude,
        );
        setGooglePlaces(googleResults);
      } catch (error) {
        setErrorMsg("Error getting location");
      }
    };

    fetchPlaces();
    getLocation();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleMarkerPress = (place: any) => {
    console.log("Marker tapped:", place.name);
  };

  const handleSearchArea = async () => {
    if (!mapRegion) {
      console.warn("No visible region available.");
      return;
    }
    const { latitude, longitude } = mapRegion;
    console.log("Searching this area:", latitude, longitude);
    if (activeSearchLabel) {
      const results = await fetchPlacesByTextSearch(activeSearchLabel, latitude, longitude);
      setGooglePlaces(results);
    } else if (selectedCategories.length > 0) {
      const newCategoryPlaces = { ...categoryPlaces };
      for (const categoryType of selectedCategories) {
        const results = await fetchNearbyPlaces(latitude, longitude, categoryType);
        newCategoryPlaces[categoryType] = results;
      }
      setCategoryPlaces(newCategoryPlaces);
    } else {
      const results = await fetchNearbyPlaces(latitude, longitude);
      setGooglePlaces(results);
    }
  };
  

  if (errorMsg) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <Text>{errorMsg}</Text>
        </View>
      </>
    );
  }

  if (!region) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <ActivityIndicator />
          <Text>Loading map…</Text>
        </View>
      </>
    );
  }

  const displayPlaces = getDisplayPlaces();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
          mapPadding={{ bottom: 0, top: 0, left: 0, right: 0 }}
          onRegionChangeComplete={(newRegion) => {
            setMapRegion(newRegion);
          }}
        >
          {/* Supabase Motives */}
          {places.map((place) => {
            const lat = parseFloat(place.latitude);
            const lng = parseFloat(place.longitude);

            if (isNaN(lat) || isNaN(lng)) {
              console.log("Invalid coordinates for place:", place);
              return null;
            }

            return (
              <Marker
                key={`supabase-${place.id}`}
                coordinate={{ latitude: lat, longitude: lng }}
                title={place.name}
                description={place.description}
                onPress={() => handleMarkerPress(place)}
              />
            );
          })}

          {/* Google Places - now filtered by selected categories */}
          {displayPlaces.map((place, index) => (
            <Marker
              key={`google-${index}`}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor={colors.mapMarker}
            />
          ))}
        </MapView>


          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.searchAreaButton} 
                onPress={handleSearchArea}
              >
                <Ionicons name="search" size={20} color={colors.submitBtnText} style={{ marginRight: 8 }} />
                <Text style={styles.searchAreaText}>Search this area</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Show active categories and search label indicator */}
          {(selectedCategories.length > 0 || activeSearchLabel) && (
            <View style={styles.activeCategoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeCategoriesScroll}>
                {activeSearchLabel && (
                  <View style={styles.searchPill}>
                    <Text style={styles.searchPillText}>{activeSearchLabel}</Text>
                    <TouchableOpacity onPress={() => setActiveSearchLabel(null)}>
                      <Ionicons name="close" size={16} color={colors.secondary} style={styles.activeCategoryClose} />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedCategories.map((category) => {
                  const categoryData = [
                    {
                      icon: "pizza",
                      label: "Food",
                      type: ["restaurant", "cafe", "bakery", "meal_takeaway", "meal_delivery"],
                    },
                    {
                      icon: "game-controller",
                      label: "Games",
                      type: ["arcade", "video_store", "gaming_cafe"],
                    },
                    {
                      icon: "sparkles",
                      label: "Fun",
                      type: ["amusement_park", "bowling_alley", "movie_theater", "zoo"],
                    },
                    {
                      icon: "leaf",
                      label: "Nature",
                      type: ["park", "campground", "tourist_attraction", "hiking_trail"],
                    },
                    {
                      icon: "body",
                      label: "Chill",
                      type: ["spa", "beauty_salon", "massage_spa"],
                    },
                    {
                      icon: "school",
                      label: "Learn",
                      type: ["museum", "library", "university", "art_gallery"],
                    },
                    {
                      icon: "bag-handle",
                      label: "Shopping",
                      type: ["shopping_mall", "department_store", "clothing_store", "shoe_store"],
                    },
                    {
                      icon: "musical-notes",
                      label: "Music",
                      type: ["night_club", "bar", "concert_hall", "music_store"],
                    },
                  ].find(item => item.type.includes(category));
                  if (!categoryData) return null;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={styles.activeCategoryChip}
                      onPress={() => handleCategoryToggle(category)}
                    >
                      <Ionicons name={categoryData.icon as any} size={16} color={colors.text} style={styles.activeCategoryIcon} />
                      <Text style={styles.activeCategoryLabel}>{categoryData.label}</Text>
                      <Ionicons name="close" size={16} color={colors.secondary} style={styles.activeCategoryClose} />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.currentLocationButton,
              keyboardVisible && { bottom: 200 }
            ]}
            onPress={goToCurrentLocation}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Only show bottom panel when modal is NOT visible */}
          {!modalVisible && (
            <SafeAreaView 
              style={[
                styles.bottomPanelSafe,
                keyboardVisible && { bottom: 0 }
              ]} 
              edges={["bottom"]}
            >
              <View style={styles.bottomPanel}>
                <Pressable style={({ pressed }) => styles.exploreButton} onPress={openModal}>
                  <Text style={styles.exploreButtonText}>^</Text>
                  <Text style={styles.exploreButtonText}>Explore</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          )}
        </View>

        {/* Animated Modal for Categories */}
        {modalVisible && (
          <View style={StyleSheet.absoluteFill}>
            {/* Dimmed background */}
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={closeModal}
              activeOpacity={1}
            />

            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [Dimensions.get("window").height, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalContent}>
                {/* Close button at the top */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Search Input with proper styling */}
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color={colors.inputPlaceholder} style={styles.searchIcon} />
                  <TextInput
                    placeholder="Search places or names..."
                    placeholderTextColor={colors.inputPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={async () => {
                      await handleSearch();
                      closeModal();
                    }}
                    style={styles.modalSearchInput}
                    returnKeyType="search"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}
                      style={styles.clearButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={20} color={colors.inputPlaceholder} />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.categoryTitle}>Choose Categories</Text>

                <ScrollView style={styles.categoryScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.categoryGrid}>
                    {[
                      {
                        icon: "pizza",
                        label: "Food",
                        type: ["restaurant", "cafe", "bakery", "meal_takeaway", "meal_delivery"],
                      },
                      {
                        icon: "game-controller",
                        label: "Games",
                        type: ["arcade", "video_store", "gaming_cafe"],
                      },
                      {
                        icon: "sparkles",
                        label: "Fun",
                        type: ["amusement_park", "bowling_alley", "movie_theater", "zoo"],
                      },
                      {
                        icon: "leaf",
                        label: "Nature",
                        type: ["park", "campground", "tourist_attraction", "hiking_trail"],
                      },
                      {
                        icon: "body",
                        label: "Chill",
                        type: ["spa", "beauty_salon", "massage_spa"],
                      },
                      {
                        icon: "school",
                        label: "Learn",
                        type: ["museum", "library", "university", "art_gallery"],
                      },
                      {
                        icon: "bag-handle",
                        label: "Shopping",
                        type: ["shopping_mall", "department_store", "clothing_store", "shoe_store"],
                      },
                      {
                        icon: "musical-notes",
                        label: "Music",
                        type: ["night_club", "bar", "concert_hall", "music_store"],
                      },
                    ].map((item, index) => {
                      const isSelected = selectedCategories.some(cat => item.type.includes(cat));
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.categoryButton,
                            isSelected && styles.categoryButtonSelected
                          ]}
                          onPress={() => {
                            // Toggle all types in this category
                            const hasAnySelected = selectedCategories.some(cat => item.type.includes(cat));
                            if (hasAnySelected) {
                              // Remove all types from this category
                              setSelectedCategories(prev => prev.filter(cat => !item.type.includes(cat)));
                            } else {
                              // Add the first type from this category
                              setSelectedCategories(prev => [...prev, item.type[0]]);
                            }
                          }}
                        >
                          <Ionicons name={item.icon as any} size={24} color={colors.text} style={styles.categoryIcon} />
                          <Text style={[
                            styles.categoryLabel,
                            isSelected && styles.categoryLabelSelected
                          ]}>
                            {item.label}
                          </Text>
                          {isSelected && (
                            <View style={styles.selectedIndicator}>
                              <Ionicons name="checkmark" size={14} color={colors.submitBtnText} />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}