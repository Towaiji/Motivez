import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Stack } from "expo-router";

export default function MapScreen() {
const [region, setRegion] = useState<{
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null>(null);

const [errorMsg, setErrorMsg] = useState<string | null>(null);


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
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
    </MapView> 
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
});
