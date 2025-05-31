import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput } from "react-native";
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
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        />

        <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.topBar}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <TextInput
              placeholder="Search a location..."
              placeholderTextColor="#ccc"
              style={styles.searchInput}
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    fontSize: 16,
    color: "white",
  },
});
