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
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../../constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Dummy motives created by the user
const dummyMotives = [
  {
    id: '1',
    title: 'Go-Karting Night',
    date: '2025-05-11',
    image: 'https://picsum.photos/id/237/400/240',
    privacy: 'Public',
    attendees: 4,
  },
  {
    id: '2',
    title: 'Study Session at Café',
    date: '2025-06-07',
    image: 'https://picsum.photos/id/1056/400/240',
    privacy: 'Friends Only',
    attendees: 2,
  },
  {
    id: '3',
    title: 'Rooftop Yoga',
    date: '2025-04-03',
    image: 'https://picsum.photos/id/1025/400/240',
    privacy: 'Public',
    attendees: 7,
  },
  {
    id: '4',
    title: 'Jazz Night Out',
    date: '2025-02-14',
    image: 'https://picsum.photos/id/1080/400/240',
    privacy: 'Friends Only',
    attendees: 3,
  },
];

export default function MyMotivesScreen() {
  const router = useRouter();
  const [motives, setMotives] = useState<typeof dummyMotives>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setMotives(dummyMotives);
      setLoading(false);
    }, 600);
  }, []);

  const renderMotive = ({ item }: { item: typeof dummyMotives[0] }) => (
    <View style={styles.motiveCard}>
      <Image source={{ uri: item.image }} style={styles.motiveImage} />
      <View style={styles.motiveInfo}>
        <Text style={styles.motiveTitle}>{item.title}</Text>
        <Text style={styles.motiveDate}>Date: {item.date}</Text>
        <Text style={styles.motivePrivacy}>
          <Ionicons
            name={item.privacy === 'Public' ? 'earth' : 'lock-closed'}
            size={15}
            color={item.privacy === 'Public' ? colors.success : colors.primary}
          />{' '}
          {item.privacy}
        </Text>
        <Text style={styles.motiveAttendees}>
          <Ionicons name="people-outline" size={15} color={colors.secondary} /> {item.attendees} Attending
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
            <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>My Motivez</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.loadingText}>Loading your Motivez...</Text>
          </View>
        ) : motives.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="create-outline" size={60} color={colors.grey} />
            <Text style={styles.emptyText}>You haven't created any Motivez yet.</Text>
          </View>
        ) : (
          <FlatList
            data={motives}
            keyExtractor={(item) => item.id}
            renderItem={renderMotive}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const createStyles = (c: typeof lightColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: c.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: c.textPrimary,
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
    color: c.textSecondary,
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  motiveCard: {
    backgroundColor: c.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: c.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  motiveImage: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  motiveInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  motiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: c.textPrimary,
    marginBottom: 4,
  },
  motiveDate: {
    fontSize: 14,
    color: c.textSecondary,
  },
  motivePrivacy: {
    fontSize: 13,
    marginTop: 3,
    color: c.textSecondary,
  },
  motiveAttendees: {
    fontSize: 13,
    marginTop: 3,
    color: c.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 17,
    color: c.grey,
    textAlign: 'center',
    fontWeight: '500',
  },
});
