import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/Colors';

// Dummy saved motives
const dummySaved = [
  {
    id: '1',
    title: 'Go-Karting Night',
    image: 'https://picsum.photos/id/237/400/250',
    location: 'Kart World',
    date: '2025-05-12',
    savedBy: 'Sara Ahmed',
  },
  {
    id: '2',
    title: 'Beach Bonfire',
    image: 'https://picsum.photos/id/1018/400/250',
    location: 'Sunny Beach',
    date: '2025-06-08',
    savedBy: 'Jay Patel',
  },
  {
    id: '3',
    title: 'Jazz in the Park',
    image: 'https://picsum.photos/id/1056/400/250',
    location: 'Central Park',
    date: '2025-06-14',
    savedBy: 'You',
  },
];

export default function SavedScreen() {
  const router = useRouter();
  const [saved, setSaved] = useState<typeof dummySaved>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setSaved(dummySaved);
      setLoading(false);
    }, 600);
  }, []);

  const renderSaved = ({ item }: { item: typeof dummySaved[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          <Ionicons name="location-outline" size={15} color="#007AFF" /> {item.location}
        </Text>
        <Text style={styles.meta}>
          <Ionicons name="calendar-outline" size={15} color="#e91e63" /> {item.date}
        </Text>
        <Text style={styles.meta}>
          <Ionicons name="bookmark-outline" size={15} color="#333" /> Saved by: {item.savedBy}
        </Text>
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
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Saved</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading saved Motivez...</Text>
          </View>
        ) : saved.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={60} color="#cccccc" />
            <Text style={styles.emptyText}>No saved Motivez yet.</Text>
          </View>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(item) => item.id}
            renderItem={renderSaved}
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
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.textSecondary,
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
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
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
  },
});

