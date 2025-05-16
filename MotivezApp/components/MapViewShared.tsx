import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, ViewStyle } from 'react-native';
import * as Location from 'expo-location';
import { Region, PROVIDER_GOOGLE as RN_PROVIDERS } from 'react-native-maps';
import { PlatformMapView, PlatformMarker } from './PlatformMap';

// Define the shape of the location coordinates
interface LocationCoords {
  lat: number;
  lng: number;
}

// Optional props interface, if you plan to extend
interface MapViewSharedProps {
  style?: ViewStyle;
}

// Unified MapView component for web and native
const MapViewShared: React.FC<MapViewSharedProps> = ({ style }) => {
  const [loc, setLoc] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine provider only for native platforms
  const PROVIDER_GOOGLE = Platform.OS !== 'web' ? RN_PROVIDERS : undefined;

  // Request location permission and fetch current position
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLoc({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (err: any) {
        setError(`Error fetching location: ${err.message}`);
      }
    };
    getLocation();
  }, []);

  // Error state
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Loading state
  if (!loc) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Loading…</Text>
      </View>
    );
  }

  // Render
  return (
    <PlatformMapView
      style={[styles.map, style]}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      } as Region}
      showsUserLocation={Platform.OS !== 'web'}
      showsMyLocationButton={Platform.OS !== 'web'}
    >
      {/* Add marker on web since showsUserLocation doesn't work there */}
      {Platform.OS === 'web' && (
        <PlatformMarker
          coordinate={{ latitude: loc.lat, longitude: loc.lng }}
          title="Your location"
        />
      )}
    </PlatformMapView>
  );
};

export default MapViewShared;

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
