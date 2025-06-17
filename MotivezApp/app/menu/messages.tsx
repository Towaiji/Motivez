import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTime } from '../lib/formatTime';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [friends, setFriends] = useState([
    { id: 'friend1', name: 'Alice' },
    { id: 'friend2', name: 'Bob' },
    // Add more friends as needed
  ]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const createNewChat = async () => {
    // Replace this with your actual logic to create a new chat
    console.log('Creating new chat with friends:', selectedFriends);
    setIsModalVisible(false);
    // You might want to navigate to the new chat after creating it
  };

  useEffect(() => {
    // Fetch friends here (replace with your actual logic)
    // Example:
    // async function fetchFriends() {
    //   const { data, error } = await supabase.from('friends').select('*').eq('user_id', CURRENT_USER_ID);
    //   if (data) setFriends(data);
    //   if (error) console.error('Error fetching friends:', error);
    // }
    // fetchFriends();
  }, []);

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => router.push(`/menu/messages/${item.id}`)}
    >
      <Image source={{ uri: item.avatar_url || undefined }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{formatTime(item.updated_at)}</Text>
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
          <TouchableOpacity onPress={toggleModal}>
            <Ionicons name="add" size={28} color="#333" />
          </TouchableOpacity>
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

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Friends</Text>
              {friends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.friendItem,
                    selectedFriends.includes(friend.id) && styles.selectedFriendItem,
                  ]}
                  onPress={() => handleFriendSelection(friend.id)}
                >
                  <Text>{friend.name}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={createNewChat}>
                  <Text>Create Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'space-between', // Added to push the add button to the right
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

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedFriendItem: {
    backgroundColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});
