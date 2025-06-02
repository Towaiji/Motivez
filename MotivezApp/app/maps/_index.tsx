import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

const goToCurrentLocation = () => {
  if (mapRef.current && region) {
    mapRef.current.animateToRegion(region, 300);
  }
};


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

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
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
        />


        {/* Top Back Button Only */}
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Return back to original position button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={goToCurrentLocation}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={24} color="#000" />
        </TouchableOpacity>

        {/* Bottom Floating Search Bar */}
        <SafeAreaView style={styles.bottomPanelSafe} edges={["bottom"]}>
          <View style={styles.bottomPanel}>
            <View style={styles.searchRow}>
              <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Search for something fun..."
                placeholderTextColor="#999"
                style={styles.bottomSearchInput}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
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
  bottomSearchSafe: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  bottomPanelSafe: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  alignItems: "center",
  paddingBottom: -60,
},

bottomPanel: {
  backgroundColor: "#fff",
  width: "100%",
  paddingHorizontal: 20,
  paddingTop: 10,
  paddingBottom: 40,
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
  //backgroundColor: "#f3f4f6",
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
    bottom: 135, // adjust vertical position
    right: 20,   // adjust horizontal position
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    
    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },

    // Elevation for Android
    elevation: 8,
  },
});
