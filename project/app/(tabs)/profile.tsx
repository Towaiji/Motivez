import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Settings, Grid3x3 as Grid3X3, Bookmark as BookmarkSimple, MapPin, Calendar } from 'lucide-react-native';

const PROFILE = {
  name: 'Jessica Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  location: 'New York City',
  bio: 'Adventure seeker 🌎 | Yoga enthusiast 🧘‍♀️ | Always up for trying new things!',
  stats: {
    points: 1250,
    activities: 45,
    friends: 286,
  },
};

const MOMENTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?w=800',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1508900436165-e4dc72293afc?w=800',
  },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <Settings size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.profile}>
          <Image source={{ uri: PROFILE.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{PROFILE.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>{PROFILE.location}</Text>
          </View>
          <Text style={styles.bio}>{PROFILE.bio}</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{PROFILE.stats.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{PROFILE.stats.activities}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{PROFILE.stats.friends}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Grid3X3 size={20} color="#6366F1" />
            <Text style={[styles.tabText, styles.activeTabText]}>Moments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <BookmarkSimple size={20} color="#6B7280" />
            <Text style={styles.tabText}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.tabText}>Calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.momentsGrid}>
          {MOMENTS.map((moment) => (
            <TouchableOpacity key={moment.id} style={styles.momentItem}>
              <Image source={{ uri: moment.image }} style={styles.momentImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  profile: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter_400Regular',
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter_400Regular',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  tabs: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter_600SemiBold',
  },
  activeTabText: {
    color: '#6366F1',
  },
  momentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  momentItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  momentImage: {
    width: '100%',
    height: '100%',
  },
});