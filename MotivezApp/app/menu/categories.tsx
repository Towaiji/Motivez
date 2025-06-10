import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { id: 'fun', label: '🎉 Fun' },
  { id: 'chill', label: '🌿 Chill' },
  { id: 'sports', label: '⚽ Sports' },
  { id: 'music', label: '🎵 Music' },
  { id: 'study', label: '📚 Study' },
  { id: 'food', label: '🍔 Food' },
  { id: 'adventure', label: '🗻 Adventure' },
  { id: 'arts', label: '🎨 Arts' },
  { id: 'gaming', label: '🎮 Gaming' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CategoriesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Categories</Text>
          <View style={{ width: 32 }} /> {/* placeholder to center title */}
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Choose a Category</Text>
          <Text style={styles.subtext}>
            Filter activities by selecting one or more categories below.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : cat.id)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Example: Show selected category */}
          {selectedCategory && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedText}>
                Showing results for:{' '}
                <Text style={styles.selectedCategoryLabel}>
                  {
                    categories.find((c) => c.id === selectedCategory)
                      ?.label
                  }
                </Text>
              </Text>
              {/* Replace below with actual filtered content */}
              <Text style={styles.placeholderContent}>
                (Filtered activities would appear here)
              </Text>
            </View>
          )}

          {!selectedCategory && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderHint}>
                No category selected. Scroll the chips above to choose a category.
              </Text>
            </View>
          )}
        </ScrollView>
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
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#f4f6f8',
    minHeight: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  chipRow: {
    paddingBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 16,
    color: '#333333',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  selectedSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  selectedCategoryLabel: {
    fontWeight: '700',
    color: '#007AFF',
  },
  placeholderContent: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  placeholderContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderHint: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
  },
});
