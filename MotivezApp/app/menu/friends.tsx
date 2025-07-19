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
import { supabase } from '../lib/supabase';
import { useAuth } from '../_layout';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Friend {
  id: string;
  name: string | null;
  username: string | null;
}

export default function FriendsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFriends();
  }, [user]);

  async function fetchFriends() {
    setLoading(true);

    // Fetch all friendships where current user is involved
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('user1_id, user2_id');

    if (error) {
      console.error('Error fetching friendships:', error);
      setLoading(false);
      return;
    }

    // Find all user IDs that are friends with current user
    const friendIds = (friendships || [])
      .map(f =>
        f.user1_id === user?.id ? f.user2_id :
          f.user2_id === user?.id ? f.user1_id :
            null
      )
      .filter(Boolean);

    if (friendIds.length === 0) {
      setFriends([]);
      setLoading(false);
      return;
    }

    // Batch fetch all friend profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, username')
      .in('id', friendIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      setLoading(false);
      return;
    }

    setFriends(profiles || []);
    setLoading(false);
  }


  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <Image
        source={{
          uri:
            item.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'M')}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>@{item.username}</Text>
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
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Friends</Text>
          <View style={{ width: 32 }} />
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
