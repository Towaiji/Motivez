import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Dummy memories data (replace with backend API later)
const dummyMemories = [
  {
    id: '1',
    title: 'Go-Karting Night',
    date: '2025-05-11',
    image: 'https://picsum.photos/id/237/400/400',
  },
  {
    id: '2',
    title: 'Beach Bonfire',
    date: '2025-04-20',
    image: 'https://picsum.photos/id/1018/400/400',
  },
  {
    id: '3',
    title: 'Rooftop Yoga',
    date: '2025-04-03',
    image: 'https://picsum.photos/id/1025/400/400',
  },
  {
    id: '4',
    title: 'Trivia Night',
    date: '2025-03-28',
    image: 'https://picsum.photos/id/1062/400/400',
  },
  {
    id: '5',
    title: 'Jazz in the Park',
    date: '2025-02-13',
    image: 'https://picsum.photos/id/1056/400/400',
  },
  {
    id: '6',
    title: 'Night Market',
    date: '2025-02-02',
    image: 'https://picsum.photos/id/1080/400/400',
  },
];

export default function MemoriesScreen() {
  const router = useRouter();
  const [memories, setMemories] = useState<typeof dummyMemories>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setMemories(dummyMemories);
      setLoading(false);
    }, 700);
  }, []);

  const renderMemory = ({ item }: { item: typeof dummyMemories[0] }) => (
    <View style={styles.memoryCard}>
      <Image source={{ uri: item.image }} style={styles.memoryImage} />
      <View style={styles.memoryInfo}>
        <Text style={styles.memoryTitle}>{item.title}</Text>
        <Text style={styles.memoryDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Memories</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Memories...</Text>
          </View>
        ) : (
          memories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={64} color="#cccccc" />
              <Text style={styles.emptyText}>No memories yet. Go make some Motivez!</Text>
            </View>
          ) : (
            <FlatList
              data={memories}
              keyExtractor={(item) => item.id}
              renderItem={renderMemory}
              numColumns={2}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
            />
          )
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
  gridContent: {
    padding: 12,
    paddingBottom: 40,
  },
  memoryCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  memoryImage: {
    width: (SCREEN_WIDTH / 2) - 28,
    height: (SCREEN_WIDTH / 2) - 28,
    resizeMode: 'cover',
  },
  memoryInfo: {
    padding: 8,
    alignItems: 'flex-start',
  },
  memoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  memoryDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 17,
    color: '#777',
    textAlign: 'center',
    fontWeight: '500',
  },
});

