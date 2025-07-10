import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function MotiveDetail() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const { id, title, description, image } = useLocalSearchParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  // Sample location (New York City)
  const initialRegion = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightBorder,
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
            source={{ uri: image as string }} 
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
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
          
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>Downtown Area</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>March 15, 2024</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>7:00 PM</Text>
            </View>
          </View>

          <View style={styles.aboutContainer}>
            <Text style={styles.sectionTitle}>About this Motive</Text>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                Experience the vibrant energy of downtown as we explore the city's hidden gems and local hotspots. This motive is perfect for those who love urban adventures and discovering new places.
              </Text>
              <View style={styles.highlightsContainer}>
                <View style={styles.highlightItem}>
                  <Ionicons name="time-outline" size={24} color={colors.primaryBlue} />
                  <Text style={styles.highlightText}>Duration: 2-3 hours</Text>
                </View>
                <View style={styles.highlightItem}>
                  <Ionicons name="people-outline" size={24} color={colors.primaryBlue} />
                  <Text style={styles.highlightText}>Group Size: 4-8 people</Text>
                </View>
                <View style={styles.highlightItem}>
                  <Ionicons name="cash-outline" size={24} color={colors.primaryBlue} />
                  <Text style={styles.highlightText}>Estimated Cost: $25-40 per person</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              provider="google"
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: initialRegion.latitude,
                  longitude: initialRegion.longitude,
                }}
                title="Event Location"
              />
            </MapView>
          </View>

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