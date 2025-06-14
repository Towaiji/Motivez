import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, GestureResponderEvent } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
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

export default function ChatDetail() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchMessages();
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
  }, [chatId]);

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId as string)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }

  async function sendMessage() {
    if (!input.trim()) return;
    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: CURRENT_USER_ID,
      content: input.trim(),
    });
    setInput('');
  }

  async function addReaction(messageId: string, reaction: string) {
    await supabase
      .from('messages')
      .update({ reaction })
      .eq('id', messageId);
  }

  const handleLongPress = (id: string) => (e: GestureResponderEvent) => {
    addReaction(id, '❤️');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onLongPress={handleLongPress(item.id)}
      style={[styles.message, item.sender_id === CURRENT_USER_ID ? styles.me : styles.them]}
    >
      <Text style={styles.text}>{item.content}</Text>
      <View style={styles.metaRow}>
        {item.reaction && <Text style={styles.reaction}>{item.reaction}</Text>}
        <Text style={styles.time}>{dayjs(item.created_at).format('HH:mm')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Chat' }} />
      <View style={styles.container}>
        <FlatList
          data={messages}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  list: { padding: 12 },
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
  sendButton: { padding: 4 },
});
