import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeContext';
import { getColors } from '../../lib/colors';
import { useAuth } from '../_layout';

const createdMotives = [
  { id: '1', image: 'https://picsum.photos/300/300?random=11' },
  { id: '2', image: 'https://picsum.photos/300/300?random=12' },
  { id: '3', image: 'https://picsum.photos/300/300?random=13' },
  { id: '4', image: 'https://picsum.photos/300/300?random=14' },
  { id: '5', image: 'https://picsum.photos/300/300?random=15' },
  { id: '6', image: 'https://picsum.photos/300/300?random=16' },
];

const attendingMotives = [
  { id: '1', image: 'https://picsum.photos/300/300?random=21' },
  { id: '2', image: 'https://picsum.photos/300/300?random=22' },
  { id: '3', image: 'https://picsum.photos/300/300?random=23' },
  { id: '4', image: 'https://picsum.photos/300/300?random=24' },
];

const friendsList = [
  { id: '1', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: '2', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: '3', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: '4', avatar: 'https://i.pravatar.cc/100?img=4' },
  { id: '5', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: '6', avatar: 'https://i.pravatar.cc/100?img=6' },
  { id: '7', avatar: 'https://i.pravatar.cc/100?img=7' },
  { id: '8', avatar: 'https://i.pravatar.cc/100?img=8' },
];

const screenWidth = Dimensions.get('window').width;
const gridSpacing = 4;
const numCols = 3;
const itemSize = (screenWidth - gridSpacing * (numCols + 1)) / numCols;

export default function Profile() {
  const router = useRouter();
  const { profile } = useAuth(); // <-- get profile from context
  const [tab, setTab] = useState<'created' | 'attending' | 'friends'>('created');
  const { theme } = useTheme();
  const colors = getColors(theme);

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 16,
      zIndex: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginTop: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.inputBackground,
    },
    info: {
      marginLeft: 16,
      flex: 1,
    },
    username: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    bio: {
      fontSize: 14,
      color: colors.secondary,
      marginTop: 4,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 16,
    },
    statBlock: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.secondary,
      marginTop: 2,
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    grid: {
      padding: gridSpacing,
    },
    gridImage: {
      width: itemSize,
      height: itemSize,
      margin: gridSpacing / 2,
      borderRadius: 6,
      backgroundColor: '#ccc',
    },
    friendAvatar: {
      width: itemSize,
      height: itemSize,
      margin: gridSpacing / 2,
      borderRadius: itemSize / 2,
      backgroundColor: '#ccc',
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.icon} />
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=motive_user' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.username}>
              {profile?.username ? `@${profile.username}` : '@motive_user'}
            </Text>
            <Text style={styles.bio}>
              {profile?.bio || 'Exploring new places, one motive at a time 🌍'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{friendsList.length}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{createdMotives.length}</Text>
            <Text style={styles.statLabel}>Created</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{attendingMotives.length}</Text>
            <Text style={styles.statLabel}>Attending</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setTab('created')}>
            <Ionicons
              name="grid-outline"
              size={28}
              color={tab === 'created' ? colors.primaryPink : colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('attending')}>
            <Ionicons
              name="calendar-outline"
              size={28}
              color={tab === 'attending' ? colors.primaryPink : colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('friends')}>
            <Ionicons
              name="people-outline"
              size={28}
              color={tab === 'friends' ? colors.primaryPink : colors.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Content Grid */}
        {tab !== 'friends' ? (
          <FlatList
            data={tab === 'created' ? createdMotives : attendingMotives}
            keyExtractor={(item) => item.id}
            numColumns={numCols}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.gridImage} />
            )}
          />
        ) : (
          <FlatList
            data={friendsList}
            keyExtractor={(item) => item.id}
            numColumns={4}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
}
