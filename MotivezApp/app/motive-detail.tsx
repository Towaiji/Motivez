import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/ThemeContext';
import { getColors } from '../lib/colors';
import { supabase } from '../lib/supabaseClient';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function MotiveDetail() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputBorder,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.lightCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    heartButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.lightCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: width,
      height: 250,
      resizeMode: 'cover',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    contentContainer: {
      padding: 20,
      backgroundColor: colors.cardBg,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    description: {
      fontSize: 16,
      color: colors.secondary,
      lineHeight: 24,
      marginBottom: 20,
    },
    detailsContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: colors.cardAltBg,
      borderRadius: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 15,
      color: colors.text,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      marginBottom: 6, // Add spacing between rows
    },
    detailLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.secondary,
    },
    detailValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    aboutContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: colors.cardAltBg,
      borderRadius: 12,
    },
    aboutContent: {
      marginTop: 10,
    },
    aboutText: {
      fontSize: 16,
      color: colors.cardTitle,
      lineHeight: 24,
      marginBottom: 15,
    },
    highlightsContainer: {
      marginTop: 10,
    },
    highlightItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    highlightText: {
      fontSize: 15,
      color: colors.cardTitle,
      marginLeft: 10,
    },
    mapContainer: {
      marginTop: 20,
      borderRadius: 12,
      overflow: 'hidden',
    },
    map: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    pickButton: {
      marginTop: 30,
      marginBottom: 10,
      backgroundColor: colors.primaryBlue,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    pickButtonText: {
      color: colors.submitBtnText,
      fontSize: 18,
      fontWeight: '600',
    },
    shareButton: {
      marginBottom: 20,
      backgroundColor: colors.cardBg,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primaryBlue,
    },
    shareButtonText: {
      color: colors.primaryBlue,
      fontSize: 18,
      fontWeight: '600',
    },
    shareIcon: {
      marginRight: 8,
    },
  });
  const { id } = useLocalSearchParams();
  const [motive, setMotive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  // Use motive fields for all details
  const latitude = motive?.latitude;
  const longitude = motive?.longitude;

  // Get user location and calculate distance to motive
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation(null);
        setDistance(null);
        return;
      }
      let locationObj = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: locationObj.coords.latitude,
        longitude: locationObj.coords.longitude,
      });
    })();
  }, []);

  // Calculate distance when userLocation and motive location are available
  useEffect(() => {
    if (userLocation && latitude && longitude) {
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; // Radius of the earth in km
      const dLat = toRad(parseFloat(latitude) - userLocation.latitude);
      const dLon = toRad(parseFloat(longitude) - userLocation.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(userLocation.latitude)) *
          Math.cos(toRad(parseFloat(latitude))) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      setDistance(d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(2)} km`);
    } else {
      setDistance(null);
    }
  }, [userLocation, latitude, longitude]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('motives')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setMotive(null);
        } else {
          setMotive(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!motive) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Motive not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Use motive fields for all details
  const {
    title,
    description,
    image_url,
    category,
    notes,
    start_time,
    end_time,
    location,
    price,
  } = motive;

  // Format date/time
  const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString() : 'N/A';
  const formatTime = (iso: string | null) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

  // Map region
  const region = latitude && longitude ? {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : null;

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePickMotive = () => {
    console.log('Motive picked!');
  };

  const handleShare = () => {
    console.log('Share motive!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={handleLike}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? colors.primaryRed : colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image_url as string }} 
            style={styles.image}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          {distance && (
            <Text style={styles.description}>{distance} away</Text>
          )}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="location-outline" size={20} color={colors.primaryPink} style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Location</Text>
              </View>
              <Text
                style={[styles.detailValue, { fontSize: 14, maxWidth: '60%' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {location || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="calendar-outline" size={20} color={colors.primaryPink} style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Date</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(start_time)}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Ionicons name="time-outline" size={20} color={colors.primaryPink} style={{ marginRight: 4 }} />
                <Text style={styles.detailLabel}>Time</Text>
              </View>
              <Text style={styles.detailValue}>{formatTime(start_time)} - {formatTime(end_time)}</Text>
            </View>
          </View>

          <View style={styles.aboutContainer}>
            <Text style={styles.sectionTitle}>About this motive</Text>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>{description || 'No description provided.'}</Text>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelRow}>
                  <Ionicons name="happy-outline" size={20} color={colors.primaryPink} style={{ marginRight: 4 }} />
                  <Text style={styles.detailLabel}>Vibe</Text>
                </View>
                <Text style={styles.detailValue}>{category || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelRow}>
                  <Ionicons name="cash-outline" size={20} color={colors.primaryPink} style={{ marginRight: 4 }} />
                  <Text style={styles.detailLabel}>Price</Text>
                </View>
                <Text style={styles.detailValue}>{price ? `$${price}` : 'N/A'}</Text>
              </View>
            </View>
          </View>

          {region && (
            <View style={styles.mapContainer}>
              <Text style={styles.sectionTitle}>Location</Text>
              {/* Show the address above the map */}
              <Text style={[styles.detailValue, { marginBottom: 8 }]}>{location || 'N/A'}</Text>
              <MapView
                style={styles.map}
                initialRegion={region}
                provider="google"
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  title={location || title}
                />
              </MapView>
            </View>
          )}

          <TouchableOpacity 
            style={styles.pickButton}
            onPress={handlePickMotive}
          >
            <Text style={styles.pickButtonText}>Pick this motive</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={colors.primaryBlue} style={styles.shareIcon} />
            <Text style={styles.shareButtonText}>Share this motive</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}