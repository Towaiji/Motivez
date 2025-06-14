import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/Colors';

// Dummy notification data
const dummyNotifications = [
  {
    id: '1',
    type: 'invite',
    text: 'Sara Ahmed invited you to “Go-Karting Night”',
    time: 'Just now',
    icon: 'person-add-outline',
    unread: true,
  },
  {
    id: '2',
    type: 'reminder',
    text: 'Don’t forget “Trivia Night” is tonight at 7PM!',
    time: '2h ago',
    icon: 'alarm-outline',
    unread: false,
  },
  {
    id: '3',
    type: 'comment',
    text: 'Jay commented on your motive: “Great idea!”',
    time: '3h ago',
    icon: 'chatbubble-ellipses-outline',
    unread: true,
  },
  {
    id: '4',
    type: 'memory',
    text: 'Share your photos for “Beach Bonfire” in Motivez Moments!',
    time: 'Yesterday',
    icon: 'image-outline',
    unread: false,
  },
  {
    id: '5',
    type: 'event',
    text: 'New event: “Live Jazz in the Park” added nearby',
    time: '2d ago',
    icon: 'musical-notes-outline',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<typeof dummyNotifications>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setNotifications(dummyNotifications);
      setLoading(false);
    }, 600);
  }, []);

  const renderNotification = ({ item }: { item: typeof dummyNotifications[0] }) => (
    <View style={[styles.notifRow, item.unread && styles.unreadNotif]}>
      <Ionicons name={item.icon as any} size={26} color={item.unread ? "#e91e63" : "#007AFF"} style={{ marginRight: 14 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.notifText}>{item.text}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
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
          <Text style={styles.topTitle}>Notifications</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#cccccc" />
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
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
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  unreadNotif: {
    backgroundColor: '#ffebf2',
  },
  notifText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginBottom: 3,
  },
  notifTime: {
    fontSize: 13,
    color: '#888',
  },
  unreadDot: {
    width: 11,
    height: 11,
    backgroundColor: '#e91e63',
    borderRadius: 6,
    marginLeft: 10,
    marginRight: -6,
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
