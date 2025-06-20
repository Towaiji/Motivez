import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Animated, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../../lib/supabaseClient'
import { fetchNearbyPlaces } from "@/lib/fetchNearbyPlaces";

export default function MapScreen() {
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
  const searchPanelAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 300);
      }
    } else {
      console.log("No Supabase match found. Trying geocoding...");
  
      const location = await geocodeLocation(searchQuery);
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          ...location,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }, 300);
      } else {
        console.warn("Could not find location:", searchQuery);
      }
    }
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
  
    const results = await fetchNearbyPlaces(latitude, longitude);
    setGooglePlaces(results);
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

          {/* Google Places */}
          {googlePlaces.map((place, index) => (
            <Marker
              key={`google-${index}`}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="#2E8B57" // Optional: makes Google markers visually distinct
            />
          ))}
        </MapView>


          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.searchAreaButton} 
                onPress={handleSearchArea}
              >
                <Ionicons name="search" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.searchAreaText}>Search this area</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <TouchableOpacity
            style={[
              styles.currentLocationButton,
              keyboardVisible && { bottom: 200 }
            ]}
            onPress={goToCurrentLocation}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={24} color="#000" />
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
                <TouchableOpacity style={styles.exploreButton} onPress={openModal}>
                  <Text style={styles.exploreButtonText}>^</Text>
                  <Text style={styles.exploreButtonText}>Explore</Text>
                </TouchableOpacity>
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
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Search Input with proper styling */}
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                  <TextInput
                    placeholder="Search places or names..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={async () => {
                      await handleSearch();
                      closeModal();
                    }}
                    style={styles.modalSearchInput}
                    returnKeyType="search"
                  />
                </View>

                <Text style={styles.categoryTitle}>Choose a Category</Text>

                <ScrollView style={styles.categoryScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.categoryGrid}>
                    {[
                      { emoji: "🍕", label: "Food", type: "restaurant" },
                      { emoji: "🎳", label: "Fun", type: "amusement_park" },
                      { emoji: "🎶", label: "Music", type: "night_club" },
                      { emoji: "🌿", label: "Nature", type: "park" },
                      { emoji: "🧘", label: "Chill", type: "spa" },
                      { emoji: "🧠", label: "Learn", type: "museum" },
                      { emoji: "🛍️", label: "Shopping", type: "shopping_mall" },
                      { emoji: "🎮", label: "Games", type: "arcade" },
                    ].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.categoryButton}
                        onPress={async () => {
                          if (!mapRegion) return;
                          const results = await fetchNearbyPlaces(
                            mapRegion.latitude,
                            mapRegion.longitude,
                            item.type
                          );
                          setGooglePlaces(results);
                          closeModal();
                        }}
                      >
                        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                        <Text style={styles.categoryLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
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

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
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
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
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
    color: "#333",
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 135,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  searchAreaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4D6D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  searchAreaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  searchButton: {
    marginLeft: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FF4D6D",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
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
    color: "#333",
    fontWeight: "600",
  },
  fakeSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  fakeSearchText: {
    fontSize: 16,
    color: "#888",
  },
  
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    aspectRatio: 2.5,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    flexDirection: "column",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#555",
    fontWeight: "500",
  },
  categoryScrollView: {
    flex: 1,
  },
});