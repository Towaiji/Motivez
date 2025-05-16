import React, { ReactNode } from 'react';
import { Platform, View, Text, ViewProps, StyleSheet } from 'react-native';
import MapView, { Marker, MapViewProps, Region, PROVIDER_GOOGLE } from 'react-native-maps';

// Props for the platform-agnostic MapView
export interface PlatformMapViewProps extends MapViewProps, ViewProps {
  initialRegion?: Region;
  children?: ReactNode;
}

// Platform-agnostic MapView: native uses react-native-maps, web shows placeholder
export const PlatformMapView: React.ComponentType<PlatformMapViewProps> =
  Platform.OS !== 'web'
    ? (MapView as React.ComponentType<PlatformMapViewProps>)
    : (({ initialRegion, children, style, ...props }: PlatformMapViewProps) => (
        <View style={[styles.webContainer, style]} {...props}>
          <Text style={styles.webText}>Map not available on web</Text>
          {initialRegion && (
            <Text style={styles.webSubtext}>
              Centered at: {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
            </Text>
          )}
          {children}
        </View>
      ));

// Props for the platform-agnostic Marker
export interface PlatformMarkerProps extends ViewProps {
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
}

// Platform-agnostic Marker: native uses react-native-maps, web shows a simple view
export const PlatformMarker: React.ComponentType<PlatformMarkerProps> =
  Platform.OS !== 'web'
    ? (Marker as React.ComponentType<PlatformMarkerProps>)
    : (({ style, title }: PlatformMarkerProps) => (
        <View style={[styles.marker, style]}>  
          {title && <Text style={styles.markerText}>{title}</Text>}
        </View>
      ));

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  webText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  webSubtext: {
    fontSize: 12,
    color: '#666',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  markerText: {
    position: 'absolute',
    top: 10,
    width: 100,
    left: -45,
    textAlign: 'center',
    fontSize: 10,
  },
});
