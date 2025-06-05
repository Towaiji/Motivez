import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy data for trending/public motives
const dummyTrending = [
  {
    id: '1',
    user: '@sara',
    title: 'Late night go-karting 🏎️🔥',
    image: 'https://picsum.photos/id/237/400/250',
    likes: 120,
  },
  {
    id: '2',
    user: '@jay',
    title: 'Sunset beach bonfire 🌅🔥',
    image: 'https://picsum.photos/id/1018/400/250',
    likes: 98,
  },
  {
    id: '3',
    user: '@lee',
    title: 'Rooftop yoga session 🧘🏽‍♂️',
    image: 'https://picsum.photos/id/1025/400/250',
    likes: 76,
  },
  {
    id: '4',
    user: '@alex',
    title: 'Trivia night at The Pub 🍻🧠',
    image: 'https://picsum.photos/id/1062/400/250',
    likes: 89,
  },
  {
    id: '5',
    user: '@maria',
    title: 'Live jazz in the park 🎷🎶',
    image: 'https://picsum.photos/id/1056/400/250',
    likes: 102,
  },
  {
    id: '6',
    user: '@nina',
    title: 'Night market food crawl 🌮🦐',
    image: 'https://picsum.photos/id/1080/400/250',
    likes: 134,
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Explore() {
  const router = useRouter();
  const [trendingData, setTrendingData] = useState<typeof dummyTrending>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API fetch with a short delay
    setTimeout(() => {
      setTrendingData(dummyTrending);
      setLoading(false);
    }, 800);
  }, []);

  const renderCard = ({ item }: { item: typeof dummyTrending[0] }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardUser}>{item.user}</Text>
          <View style={styles.likesRow}>
            <Ionicons name="heart" size={16} color="#e91e63" />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar with Back Button and Title */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Explore & Trending</Text>
          <View style={{ width: 32 }} /> {/* spacer to center title */}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Trending Motives...</Text>
          </View>
        ) : (
          <FlatList
            data={trendingData}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555555',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: SCREEN_WIDTH * 0.5,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardUser: {
    fontSize: 14,
    color: '#777777',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 14,
    color: '#777777',
    marginLeft: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButtonLegacy: {
    position: 'absolute',
    top: 30,
    left: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
