import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Help() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL('mailto:support@motivezapp.com?subject=Help%20with%20Motivez');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Help & FAQ</Text>
          <View style={{ width: 32 }} /> {/* Spacer */}
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I create a new Motive?</Text>
            <Text style={styles.answer}>
              Tap the <Ionicons name="add-circle-outline" size={18} /> icon in the main navigation bar, select your photo, location, and details, then post your Motive!
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I invite friends to an activity?</Text>
            <Text style={styles.answer}>
              After creating or joining a Motive, you can invite friends from your friends list, or share a link to the group chat.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I save favorite activities?</Text>
            <Text style={styles.answer}>
              Tap the <Ionicons name="bookmark-outline" size={18} /> icon on any activity to save it to your favorites for quick access later.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I report an issue or give feedback?</Text>
            <Text style={styles.answer}>
              We love your feedback! Tap the button below to email our team or use the feedback form in Settings.
            </Text>
          </View>
          <TouchableOpacity style={styles.supportBtn} onPress={openEmail}>
            <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.supportText}>Contact Support</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f4f6f8',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  answer: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
    lineHeight: 22,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 32,
    alignSelf: 'center',
  },
  supportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});
