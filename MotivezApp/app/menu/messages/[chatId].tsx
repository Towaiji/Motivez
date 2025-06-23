import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTime } from '../../lib/formatTime';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  reaction?: string | null;
}

const CURRENT_USER_ID = 'demo-user'; // replace with your auth user id

interface DoubleTapProps {
  children: React.ReactNode;
  doubleTap: () => void;
  delay?: number; // in ms, optional, default 300
}

// Local DoubleTap component, not exported
const DoubleTap: React.FC<DoubleTapProps> = ({ children, doubleTap, delay = 300 }) => {
  const lastTap = useRef<number>(0);

  const handleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < delay) {
      doubleTap();
    }
    lastTap.current = now;
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function ChatDetail() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [chatName, setChatName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [demoMessages, setDemoMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const isDemoChat = chatId?.startsWith('example-chat');

  useEffect(() => {
    if (isDemoChat) {
      // Provide example messages for the demo chat
      setChatName('Alice, Bob (Example)');
      setDemoMessages([
        {
          id: 'demo-1',
          chat_id: chatId!,
          sender_id: 'friend1',
          content: 'Hey, this is a demo chat!',
          created_at: new Date().toISOString(),
          reaction: null,
        },
        {
          id: 'demo-2',
          chat_id: chatId!,
          sender_id: CURRENT_USER_ID,
          content: 'Cool! Try sending a message 👇',
          created_at: new Date().toISOString(),
          reaction: null,
        },
      ]);
    } else {
      fetchMessages();
      fetchChat();
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
          payload => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatId]);

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId as string)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }

  async function fetchChat() {
    const { data } = await supabase
      .from('chats')
      .select('name')
      .eq('id', chatId as string)
      .single();
    if (data?.name) setChatName(data.name);
  }

  async function sendMessage() {
    if (!input.trim()) return;
    if (isDemoChat) {
      setDemoMessages(prev => [
        ...prev,
        {
          id: 'demo-' + Math.random().toString(36).slice(2, 8),
          chat_id: chatId!,
          sender_id: CURRENT_USER_ID,
          content: input.trim(),
          created_at: new Date().toISOString(),
          reaction: null,
        },
      ]);
      setInput('');
      return;
    }
    // Normal Supabase logic
    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: CURRENT_USER_ID,
      content: input.trim(),
    });
    setInput('');
  }

  async function addReaction(messageId: string, reaction: string | null) {
    if (isDemoChat) {
      setDemoMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, reaction } : msg
        )
      );
    } else {
      await supabase
        .from('messages')
        .update({ reaction })
        .eq('id', messageId);
    }
  }


  const toggleReaction = async (messageId: string, currentReaction: string | null) => {
    const newReaction = currentReaction === '❤️' ? null : '❤️';
    await addReaction(messageId, newReaction);
    if (!isDemoChat) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, reaction: newReaction } : msg
        )
      );
    }
    // For demo chats, already updated in addReaction
  };

  const renderItem = ({ item }: { item: Message }) => (
    <DoubleTap
      key={item.id}
      doubleTap={() => toggleReaction(item.id, item.reaction ?? null)}
    >
      <View
        style={[styles.message, item.sender_id === CURRENT_USER_ID ? styles.me : styles.them]}
      >
        <Text style={styles.text}>{item.content}</Text>
        <View style={styles.metaRow}>
          {item.reaction && <Text style={styles.reaction}>{item.reaction}</Text>}
          <Text style={styles.time}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
    </DoubleTap>
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
          <Text style={styles.topTitle}>{chatName || 'Chat'}</Text>
          <View style={{ width: 32 }} />
        </View>

        <FlatList
          data={isDemoChat ? demoMessages : messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
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
  list: { padding: 12, paddingBottom: 80 },
  message: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  me: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  them: { alignSelf: 'flex-start', backgroundColor: '#f2f2f2' },
  text: { fontSize: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  time: { fontSize: 12, color: '#999', marginLeft: 6 },
  reaction: { fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: { padding: 4 }
});
