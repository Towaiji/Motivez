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
import { useTheme } from '../../lib/ThemeContext';
import { getColors } from '../../lib/colors';

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

  const { theme } = useTheme();
  const colors = getColors(theme);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { flex: 1, fontSize: 22, fontWeight: 'bold', color: colors.text, marginLeft: 12 },
    addButton: { marginLeft: 8 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyIcon: { marginBottom: 16 },
    emptyText: { fontSize: 18, color: colors.secondary, textAlign: 'center', marginBottom: 8 },
    emptySubText: { fontSize: 14, color: colors.secondary, textAlign: 'center' },
    list: { backgroundColor: colors.background },
    chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
    chatAvatar: { width: 54, height: 54, borderRadius: 27, marginRight: 14, backgroundColor: colors.inputBackground },
    chatInfo: { flex: 1 },
    chatName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    chatLastMsg: { fontSize: 14, color: colors.secondary, marginTop: 2 },
    chatTime: { fontSize: 12, color: colors.secondary, marginLeft: 8 },
    unreadBadge: { backgroundColor: colors.primaryPink, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
    unreadText: { color: colors.chipSelectedText, fontSize: 12, fontWeight: 'bold' },
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: colors.primaryBlue, borderRadius: 30, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', shadowColor: colors.icon, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 6 },
    fabIcon: { color: colors.chipSelectedText },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: theme === 'dark' ? 'rgba(20,20,20,0.7)' : 'rgba(0,0,0,0.5)', zIndex: 100 },
    modal: { backgroundColor: colors.modalBackground, borderRadius: 18, padding: 24, margin: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.modalText, marginBottom: 12 },
    modalInput: { backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
    modalButton: { backgroundColor: colors.primaryPink, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
    modalButtonText: { color: colors.chipSelectedText, fontWeight: 'bold', fontSize: 16 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
    chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },
    lastMessage: { fontSize: 15, color: colors.secondary, maxWidth: '97%' },
    backButton: { width: 32, alignItems: 'flex-start' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16, color: colors.secondary },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingTop: 12, paddingBottom: 40 },
    friendItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
    selectedFriendItem: { backgroundColor: theme === 'dark' ? colors.inputBackground : colors.card },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  });

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', CURRENT_USER_ID)
      .order('updated_at', { ascending: false });

    // If nothing is in Supabase, show a hardcoded example chat
    if (!data || data.length === 0) {
      setChats([
        {
          id: 'example-chat-1',
          name: 'Alice, Bob (Example)',
          avatar_url: 'https://ui-avatars.com/api/?name=Alice+Bob',
          last_message: 'This is an example chat! 👋',
          updated_at: new Date().toISOString(),
          unread: 1,
        },
      ]);
    } else {
      setChats(data as Chat[]);
    }
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
    if (selectedFriends.length === 0) {
      alert('Select at least one friend!');
      return;
    }

    // Compose a chat name
    const selectedNames = friends
      .filter(f => selectedFriends.includes(f.id))
      .map(f => f.name);
    const chatName = [CURRENT_USER_ID, ...selectedNames].join(', ');

    // Try Supabase insert (will fail if table not set up)
    let chatId: string;
    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert([
          {
            name: chatName,
            user_id: CURRENT_USER_ID,
          },
        ])
        .select()
        .single();

      if (error || !chat) throw new Error(error?.message || 'No chat created');
      chatId = chat.id;
      fetchChats();
    } catch (e) {
      // Fallback: just add locally if no Supabase
      chatId = 'local-chat-' + Math.random().toString(36).substring(2, 10);
      setChats((prev) => [
        ...prev,
        {
          id: chatId,
          name: chatName + ' (Local)',
          avatar_url: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(chatName),
          last_message: 'Welcome to your new chat!',
          updated_at: new Date().toISOString(),
          unread: 0,
        },
      ]);
    }

    setIsModalVisible(false);
    setSelectedFriends([]);
    // Navigate to the new chat (works for both real and fake)
    router.push(`/menu/messages/${chatId}`);
  };



  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => router.push(`/menu/messages/${item.id}`)}
    >
      <Image source={{ uri: item.avatar_url || undefined }} style={styles.chatAvatar} />
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
      <SafeAreaView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Ionicons name="add" size={28} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
            <Text style={styles.loadingText}>Loading Messages...</Text>
          </View>
        ) : chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={60} color={colors.secondary} />
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
          <View style={styles.overlay}>
            <View style={styles.modal}>
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
                  <Text style={styles.modalButtonText}>Create Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
