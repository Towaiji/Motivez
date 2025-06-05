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

const SCREEN_WIDTH = Dimensions.get('window').width;

// Dummy friend data (replace with real API data)
const dummyFriends = [
  {
    id: '1',
    name: 'Sara Ahmed',
    avatar: 'https://i.pravatar.cc/150?u=sara.ahmed',
    status: 'Online',
  },
  {
    id: '2',
    name: 'Jay Patel',
    avatar: 'https://i.pravatar.cc/150?u=jay.patel',
    status: 'Offline',
  },
  {
    id: '3',
    name: 'Lee Wong',
    avatar: 'https://i.pravatar.cc/150?u=lee.wong',
    status: 'Online',
  },
  {
    id: '4',
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?u=maria.garcia',
    status: 'Offline',
  },
  {
    id: '5',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex.johnson',
    status: 'Online',
  },
  {
    id: '6',
    name: 'Nina Kapoor',
    avatar: 'https://i.pravatar.cc/150?u=nina.kapoor',
    status: 'Offline',
  },
];

export default function FriendsScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<typeof dummyFriends>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setFriends(dummyFriends);
      setLoading(false);
    }, 800);
  }, []);

  const renderFriend = ({ item }: { item: typeof dummyFriends[0] }) => (
    <View style={styles.friendCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>
          {item.status === 'Online' ? (
            <Text style={{ color: '#4CAF50' }}>●</Text>
          ) : (
            <Text style={{ color: '#999999' }}>●</Text>
          )}{' '}
          {item.status}
        </Text>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#007AFF" />
      </TouchableOpacity>
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
          <Text style={styles.topTitle}>Friends</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Friends...</Text>
          </View>
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={renderFriend}
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
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: (SCREEN_WIDTH * 0.15) / 2,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  friendStatus: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  chatButton: {
    padding: 8,
  },
});
