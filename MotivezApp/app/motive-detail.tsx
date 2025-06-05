import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SharedElement } from 'react-navigation-shared-element';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function MotiveDetail() {
  const { id, title, description, image } = useLocalSearchParams();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [isLiked, setIsLiked] = useState(false);

  // Sample location (New York City)
  const initialRegion = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      })
    ]).start();
  }, []);

  const handleBack = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.spring(translateY, {
        toValue: height * 0.1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.back();
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePickMotive = () => {
    // Handle picking the motive
    console.log('Motive picked!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateY }
            ],
            opacity: opacityAnim,
          }
        ]}
      >
        <View style={styles.imageContainer}>
          <SharedElement 
            id={`item.${id}.photo`} 
            style={StyleSheet.absoluteFill}
          >
            <Image 
              source={{ uri: image as string }} 
              style={styles.image}
            />
          </SharedElement>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.heartButton}
            onPress={handleLike}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={30} 
              color={isLiked ? "#ff3b30" : "#fff"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
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
                    <Ionicons name="time-outline" size={24} color="#007AFF" />
                    <Text style={styles.highlightText}>Duration: 2-3 hours</Text>
                  </View>
                  <View style={styles.highlightItem}>
                    <Ionicons name="people-outline" size={24} color="#007AFF" />
                    <Text style={styles.highlightText}>Group Size: 4-8 people</Text>
                  </View>
                  <View style={styles.highlightItem}>
                    <Ionicons name="cash-outline" size={24} color="#007AFF" />
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
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    height: height * 0.6,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
    marginTop: height * 0.4,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    minHeight: height * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'visible',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  aboutContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  aboutContent: {
    marginTop: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
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
    color: '#333',
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
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 