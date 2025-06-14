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
import dayjs from 'dayjs';
import { supabase } from '../lib/supabase';

interface Chat {
  id: string;
  name: string;
  avatar_url?: string | null;
  last_message?: string | null;
  updated_at: string;
  unread?: number;
}

const CURRENT_USER_ID = 'demo-user';

export default function MessagesScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', CURRENT_USER_ID)
      .order('updated_at', { ascending: false });
    if (data) setChats(data as Chat[]);
    setLoading(false);
  }

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => router.push(`/menu/messages/${item.id}`)}
    >
      <Image source={{ uri: item.avatar_url || undefined }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{dayjs(item.updated_at).format('HH:mm')}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message}
        </Text>
      </View>
      {item.unread && item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
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
          <Text style={styles.topTitle}>Messages</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Messages...</Text>
          </View>
        ) : chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={60} color="#cccccc" />
            <Text style={styles.emptyText}>No chats yet. Start planning a Motive!</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChat}
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 6,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 15,
    color: '#666',
    maxWidth: '97%',
  },
  unreadBadge: {
    backgroundColor: '#e91e63',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
  },
});
