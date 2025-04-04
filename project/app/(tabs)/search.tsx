import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Search as SearchIcon, MapPin, DollarSign } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'outdoor', name: 'Outdoor', emoji: '🏃‍♂️' },
  { id: 'food', name: 'Food & Drinks', emoji: '🍽️' },
  { id: 'arts', name: 'Arts & Culture', emoji: '🎨' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'nightlife', name: 'Nightlife', emoji: '🌙' },
];

const ACTIVITIES = [
  {
    id: '1',
    title: 'Rooftop Jazz Night',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    location: 'Sky Lounge',
    price: '$30',
    category: 'nightlife',
  },
  {
    id: '2',
    title: 'Street Food Festival',
    image: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=800',
    location: 'Downtown Square',
    price: 'Free Entry',
    category: 'food',
  },
  {
    id: '3',
    title: 'Modern Art Exhibition',
    image: 'https://images.unsplash.com/photo-1594784053295-2a0b7d123e03?w=800',
    location: 'City Gallery',
    price: '$15',
    category: 'arts',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Popular Activities</Text>
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
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    width: 100,
  },
  categoryItemSelected: {
    backgroundColor: '#818CF8',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
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
});