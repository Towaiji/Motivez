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
import { supabase } from "../../lib/supabaseClient";


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
  type Motive = {
    id: string;
    title: string;
    description?: string;
    created_at?: string;
    category?: string;
    image_url?: string;
    privacy?: string;
    attendees?: number;
  };
  
  const [motives, setMotives] = useState<Motive[]>([]);
  
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMyMotives = async () => {
      setLoading(true);
    
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User fetch error:", userError);
        setLoading(false);
        return;
      }
      
    
      const { data, error } = await supabase
        .from("motives")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
    
        if (error) {
          console.error("Motives fetch error:", error);
        } else {
          console.log("Fetched motives:", data); // ✅ Add this
          setMotives(data);
        }
    
      setLoading(false);
    };    
  
    fetchMyMotives();
  }, []);
  
  

  const renderMotive = ({ item }: { item: Motive }) => (
    <View style={styles.motiveCard}>
      <Image
        source={{ uri: item.image_url || "https://picsum.photos/400/240" }}
        style={styles.motiveImage}
      />
      <View style={styles.motiveInfo}>
        <Text style={styles.motiveTitle}>{item.title}</Text>
        <Text style={styles.motiveDate}>
          Date: {item.created_at ? item.created_at.split("T")[0] : "Unknown"}
        </Text>
        <Text style={styles.motivePrivacy}>
          <Ionicons
            name={item.privacy === "Friends" ? "lock-closed" : "earth"}
            size={15}
            color={item.privacy === "Friends" ? "#e91e63" : "#4CAF50"}
          />{" "}
          {item.privacy || "Public"}
        </Text>
        <Text style={styles.motiveAttendees}>
          <Ionicons name="people-outline" size={15} color="#007AFF" />{" "}
          {item.attendees || 0} Attending
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
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>My Motivez</Text>
          <View style={{ width: 32 }} /> {/* Spacer to center title */}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading your Motivez...</Text>
          </View>
        ) : motives.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="create-outline" size={60} color="#cccccc" />
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555555',
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  motiveCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
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
    color: '#333',
    marginBottom: 4,
  },
  motiveDate: {
    fontSize: 14,
    color: '#555',
  },
  motivePrivacy: {
    fontSize: 13,
    marginTop: 3,
    color: '#666',
  },
  motiveAttendees: {
    fontSize: 13,
    marginTop: 3,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 17,
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
  },
});
