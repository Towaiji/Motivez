import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function About() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar with Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>About Motivez</Text>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* App Name & Logo */}
          <View style={styles.headerSection}>
            <Ionicons name="rocket-outline" size={48} color="#007AFF" />
            <Text style={styles.appName}>Motivez</Text>
            <Text style={styles.tagline}>Find. Plan. Remember.</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is Motivez?</Text>
            <Text style={styles.sectionText}>
              Motivez is a cross-platform mobile app designed to help users discover, plan, and share
              fun experiences with friends or on their own. Whether you're looking for a spontaneous
              weekend adventure, a group outing, or a quiet solo activity, Motivez provides tailored
              suggestions based on your mood, location, and budget.
            </Text>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.bulletText}>
                Instant activity suggestions based on mood, location, and budget
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.bulletText}>
                Create group chats, invite friends, and coordinate plans in-app
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.bulletText}>
                Share photos, videos, and reviews in Motivez Moments after each outing
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.bulletText}>
                Save favorites, view upcoming events on a calendar, and revisit past memories
              </Text>
            </View>
          </View>

          {/* Our Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              We believe life’s best moments are the ones shared with others—and sometimes discovered
              unexpectedly. Motivez aims to remove the friction of planning by delivering curated,
              real-time recommendations and an integrated social experience. Whether it’s your
              friends or new connections, every adventure should be effortless and memorable.
            </Text>
          </View>

          {/* Team & Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meet the Team</Text>
            <Text style={styles.sectionText}>
              • Ali Towaiji - Founder{"\n"}
              • Mohammed Alkukhun - Founder 
            </Text>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Contact Us</Text>
            <Text style={styles.sectionText}>
              Have feedback or questions? We'd love to hear from you.{"\n"}
              Email:{" "}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL("mailto:support@motivezapp.com")}
              >
                support@motivezapp.com
              </Text>
              {"\n"}
              Website:{" "}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL("https://www.motivezapp.com")}
              >
                www.motivezapp.com
              </Text>
            </Text>
          </View>

          {/* Version Info */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
            <Text style={styles.footerText}>© 2025 Motivez Inc.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  backButton: {
    padding: 4,
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginRight: 32, // to offset back arrow width
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#555555",
    lineHeight: 22,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: "#555555",
    marginLeft: 8,
    lineHeight: 22,
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#888888",
    marginVertical: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
