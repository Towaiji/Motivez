import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, Users, MapPin } from 'lucide-react-native';

const UPCOMING_PLANS = [
  {
    id: '1',
    title: 'Sunset Yoga Session',
    date: 'Today, 6:30 PM',
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    participants: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    ],
  },
  {
    id: '2',
    title: 'Rock Climbing Adventure',
    date: 'Tomorrow, 2:00 PM',
    location: 'Boulder Gym',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
    participants: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    ],
  },
];

const SUGGESTED_PLANS = [
  {
    id: '3',
    title: 'Paint & Sip Night',
    date: 'Fri, Mar 15 • 7:00 PM',
    location: 'Art Studio Downtown',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    price: '$35',
  },
  {
    id: '4',
    title: 'Salsa Dance Workshop',
    date: 'Sat, Mar 16 • 6:00 PM',
    location: 'Dance Studio',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
    price: '$25',
  },
];

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Plans</Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Plan</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Upcoming</Text>
        {UPCOMING_PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} style={styles.planCard}>
            <Image source={{ uri: plan.image }} style={styles.planImage} />
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              
              <View style={styles.planDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{plan.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{plan.location}</Text>
                </View>
              </View>

              <View style={styles.participants}>
                <View style={styles.avatarStack}>
                  {plan.participants.map((avatar, index) => (
                    <Image
                      key={index}
                      source={{ uri: avatar }}
                      style={[
                        styles.participantAvatar,
                        { marginLeft: index * -12 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.participantsText}>
                  {plan.participants.length} going
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Suggested Plans</Text>
        {SUGGESTED_PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} style={styles.planCard}>
            <Image source={{ uri: plan.image }} style={styles.planImage} />
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              
              <View style={styles.planDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{plan.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{plan.location}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join • {plan.price}</Text>
              </TouchableOpacity>
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
  createButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planImage: {
    width: '100%',
    height: 200,
  },
  planContent: {
    padding: 16,
  },
  planTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
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
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: 8,
  },
  participantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  participantsText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter_400Regular',
  },
  joinButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});