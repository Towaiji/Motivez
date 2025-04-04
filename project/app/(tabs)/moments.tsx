import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Camera, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const MOMENTS = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    caption: 'Amazing sunset yoga session at Central Park! 🧘‍♀️✨ #MindfulMoments #Wellness',
    likes: 234,
    comments: 18,
  },
  {
    id: '2',
    user: {
      name: 'Mike Ross',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
    caption: 'First time rock climbing and conquered my fears! 🧗‍♂️ #Adventure #Motivation',
    likes: 456,
    comments: 32,
  },
];

export default function MomentsScreen() {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Moments</Text>
          <TouchableOpacity onPress={pickImage} style={styles.addButton}>
            <Camera size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {MOMENTS.map((moment) => (
          <View key={moment.id} style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <Image source={{ uri: moment.user.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{moment.user.name}</Text>
            </View>
            
            <Image source={{ uri: moment.image }} style={styles.momentImage} />
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={24} color="#374151" />
                <Text style={styles.actionText}>{moment.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color="#374151" />
                <Text style={styles.actionText}>{moment.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.caption}>
              <Text style={styles.captionText}>{moment.caption}</Text>
            </View>
          </View>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  momentCard: {
    marginBottom: 20,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  momentImage: {
    width: '100%',
    height: 400,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter_400Regular',
  },
  caption: {
    padding: 12,
  },
  captionText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter_400Regular',
  },
});