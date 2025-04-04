import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, MapPin, DollarSign } from 'lucide-react-native';

const MOODS = [
  { id: 'chill', name: 'Chill', emoji: '😌' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🤠' },
  { id: 'social', name: 'Social', emoji: '🎉' },
  { id: 'romantic', name: 'Romantic', emoji: '💝' },
  { id: 'creative', name: 'Creative', emoji: '🎨' },
];

const ACTIVITIES = [
  {
    id: '1',
    title: 'Sunset Yoga in the Park',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    location: 'Central Park',
    price: 'Free',
    mood: 'chill',
  },
  {
    id: '2',
    title: 'Rock Climbing Adventure',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
    location: 'Boulder Gym',
    price: '$25',
    mood: 'adventurous',
  },
  {
    id: '3',
    title: 'Paint & Sip Night',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    location: 'Art Studio',
    price: '$35',
    mood: 'creative',
  },
];

export default function DiscoverScreen() {
  const [selectedMood, setSelectedMood] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>How are you feeling today?</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodList}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodItem,
                selectedMood === mood.id && styles.moodItemSelected,
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodName}>{mood.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recommended for you</Text>

        {ACTIVITIES.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.activityCard}>
            <Image source={{ uri: activity.image }} style={styles.activityImage} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <View style={styles.activityDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{activity.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{activity.price}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.likeButton}>
              <Heart size={20} color="#6B7280" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
  },
  moodList: {
    marginBottom: 32,
  },
  moodItem: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    width: 100,
  },
  moodItemSelected: {
    backgroundColor: '#818CF8',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityImage: {
    width: '100%',
    height: 200,
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  activityDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  likeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});