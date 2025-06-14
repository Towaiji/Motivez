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

const dummyChats = [
  {
    id: '1',
    name: 'Sara Ahmed',
    avatar: 'https://i.pravatar.cc/150?u=sara.ahmed',
    lastMessage: 'See you at 8!',
    time: '10:24 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Jay Patel',
    avatar: 'https://i.pravatar.cc/150?u=jay.patel',
    lastMessage: 'On my way 🚗',
    time: '9:11 AM',
    unread: 0,
  },
  {
    id: '3',
    name: 'Go Kart Crew',
    avatar: 'https://i.pravatar.cc/150?u=gokart.group',
    lastMessage: 'Let’s book for Friday?',
    time: 'Yesterday',
    unread: 1,
  },
  {
    id: '4',
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?u=maria.garcia',
    lastMessage: 'Had so much fun last night!',
    time: 'Mon',
    unread: 0,
  },
  {
    id: '5',
    name: 'Trivia Night',
    avatar: 'https://i.pravatar.cc/150?u=trivia.group',
    lastMessage: 'Scoreboard updated! 🏆',
    time: 'Sun',
    unread: 5,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<typeof dummyChats>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setChats(dummyChats);
      setLoading(false);
    }, 600);
  }, []);

  const renderChat = ({ item }: { item: typeof dummyChats[0] }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => {
        // router.push(`/menu/messages/${item.id}`);
        // For now, just alert (replace with your navigation)
        alert(`Go to chat with ${item.name}`);
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
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
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Messages</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
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
    color: colors.text,
    flex: 1,
    marginRight: 6,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 15,
    color: colors.textSecondary,
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
