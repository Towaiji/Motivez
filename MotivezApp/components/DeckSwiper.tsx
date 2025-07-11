import { transform } from '@babel/core';
import React, { useState, useRef, JSX } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Type definitions
interface Friend {
  username: string;
  avatar: { uri: string };
}

interface Card {
  id: string;
  title: string;
  location: string;
  distance: string;
  vibes: string[];
  description: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  openHours: string;
  features: string[];
  friends: Friend[];
}

// Enhanced mock data with more details
const cards: Card[] = [
  {
    id: '1',
    title: 'Axe Throwing',
    location: 'Downtown Arena',
    distance: '3.2 km',
    vibes: ['Adventure', 'Fun'],
    description: 'Experience the thrill of axe throwing in a safe, supervised environment. Perfect for groups and beginners welcome!',
    price: '$25-35 per person',
    duration: '1-2 hours',
    rating: 4.8,
    reviews: 127,
    openHours: 'Mon-Thu: 5PM-10PM, Fri-Sun: 2PM-11PM',
    features: ['Beginner Friendly', 'Group Bookings', 'Safety Equipment Provided', 'Indoor Activity'],
    friends: [
      { username: 'sara', avatar: { uri: 'https://randomuser.me/api/portraits/women/68.jpg' } },
      { username: 'mohammed', avatar: { uri: 'https://randomuser.me/api/portraits/men/72.jpg' } },
      { username: 'zain', avatar: { uri: 'https://randomuser.me/api/portraits/men/36.jpg' } },
    ],
  },
  {
    id: '2',
    title: 'Board Game Cafe',
    location: 'Queen Street',
    distance: '1.5 km',
    vibes: ['Relaxing', 'Social'],
    description: 'Cozy cafe with over 200 board games to choose from. Great coffee, snacks, and a welcoming atmosphere for all skill levels.',
    price: '$8-15 per person',
    duration: '2-4 hours',
    rating: 4.6,
    reviews: 89,
    openHours: 'Daily: 10AM-11PM',
    features: ['200+ Games', 'Food & Drinks', 'Tournaments', 'Private Tables'],
    friends: [
      { username: 'sara', avatar: { uri: 'https://randomuser.me/api/portraits/women/68.jpg' } },
      { username: 'mohammed', avatar: { uri: 'https://randomuser.me/api/portraits/men/72.jpg' } },
    ],
  },
  {
    id: '3',
    title: 'Art Gallery',
    location: 'King & Spadina',
    distance: '2.1 km',
    vibes: ['Cultural', 'Inspiring'],
    description: 'Contemporary art gallery featuring local and international artists. Current exhibition: "Urban Landscapes in Modern Art"',
    price: '$12-18 per person',
    duration: '1-3 hours',
    rating: 4.7,
    reviews: 64,
    openHours: 'Tue-Sun: 10AM-6PM, Closed Mondays',
    features: ['Guided Tours', 'Gift Shop', 'Student Discounts', 'Photography Allowed'],
    friends: [
      { username: 'zain', avatar: { uri: 'https://randomuser.me/api/portraits/men/36.jpg' } },
    ],
  },
  {
    id: '4',
    title: 'Escape Room',
    location: 'Bay & Dundas',
    distance: '4.0 km',
    vibes: ['Mystery', 'Teamwork'],
    description: 'Challenge your problem-solving skills with themed escape rooms. Choose from horror, mystery, or adventure themes.',
    price: '$30-45 per person',
    duration: '1 hour',
    rating: 4.9,
    reviews: 203,
    openHours: 'Daily: 12PM-10PM',
    features: ['Multiple Themes', 'Team Building', 'Hint System', 'Photo Opportunities'],
    friends: [
      { username: 'sara', avatar: { uri: 'https://randomuser.me/api/portraits/women/68.jpg' } },
      { username: 'mohammed', avatar: { uri: 'https://randomuser.me/api/portraits/men/72.jpg' } },
      { username: 'zain', avatar: { uri: 'https://randomuser.me/api/portraits/men/36.jpg' } },
    ],
  },
  {
    id: '5',
    title: 'Jazz Night',
    location: 'Harbourfront Centre',
    distance: '2.8 km',
    vibes: ['Music', 'Chill'],
    description: 'Live jazz performances every Friday night featuring local musicians. Intimate setting with craft cocktails and small plates.',
    price: '$20-30 cover charge',
    duration: '3-4 hours',
    rating: 4.5,
    reviews: 156,
    openHours: 'Fridays: 7PM-11PM',
    features: ['Live Music', 'Craft Cocktails', 'Small Plates', 'Intimate Venue'],
    friends: [
      { username: 'mohammed', avatar: { uri: 'https://randomuser.me/api/portraits/men/72.jpg' } },
    ],
  },
];

const DeckSwiper: React.FC = () => {
  const swiperRef = useRef<Swiper<Card>>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  const handleSwipeRight = (index: number): void => {
    console.log('Liked:', cards[index]?.title);
    // Placeholder for future backend logging
    // sendSwipeToBackend(cards[index], 'like')
  };

  const handleSwipeLeft = (index: number): void => {
    console.log('Skipped:', cards[index]?.title);
    // Placeholder for future backend logging
    // sendSwipeToBackend(cards[index], 'skip')
  };

  const [allSwiped, setAllSwiped] = useState<boolean>(false);
  const [swiperKey, setSwiperKey] = useState<number>(0);

  const resetDeck = (): void => {
    setAllSwiped(false);
    setSwiperKey(prev => prev + 1); // Force re-render of swiper
  };

  const openCardDetails = (card: Card): void => {
    setSelectedCard(card);
    setDetailModalVisible(true);
  };

  const closeCardDetails = (): void => {
    setDetailModalVisible(false);
    setSelectedCard(null);
  };

  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Feather key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />);
    }
    if (hasHalfStar) {
      stars.push(<Feather key="half" name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />);
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {allSwiped ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Time for a Break!</Text>
          <Text style={styles.emptySubtitle}>Check back later for new adventures</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetDeck}>
            <Text style={styles.resetButtonText}>Refresh Feed</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Swiper
          key={swiperKey} // Force re-render when reset
          ref={swiperRef}
          cards={cards}
          renderCard={(card: Card) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => openCardDetails(card)}
              activeOpacity={0.95}
            >
              <Text style={styles.title}>{card.title}</Text>

              <View style={styles.row}>
                <Feather name="map-pin" size={16} color="black" style={styles.icon} />
                <Text style={styles.details}>{card.location}</Text>
              </View>

              <View style={styles.row}>
                <Feather name="navigation" size={16} color="black" style={styles.icon} />
                <Text style={styles.details}>{card.distance}</Text>
              </View>

              {/* Vibe Pills replacing the type line */}
              <View style={styles.vibePillsContainer}>
                {card.vibes.map((vibe: string) => (
                  <View key={vibe} style={styles.vibePill}>
                    <Text style={styles.vibePillText}>{vibe}</Text>
                  </View>
                ))}
              </View>

              {card.friends && card.friends.length > 0 && (
                <View style={styles.friendRow}>
                  <View style={styles.avatarGroup}>
                    {card.friends.slice(0, 5).map((friend: Friend, index: number) => (
                      <View key={friend.username} style={[styles.avatarContainer, { marginLeft: index === 0 ? 0 : -12 }]}>
                        <Image source={friend.avatar} style={styles.avatarImage} />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.friendText}>Friends have visited</Text>
                </View>
              )}

              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: 43.65107,       
                  longitude: -79.347015,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                showsUserLocation={false}
                showsMyLocationButton={false}
              >
                <Marker
                  coordinate={{
                    latitude: 43.65107,
                    longitude: -79.347015,
                  }}
                  title="Activity Location"
                />
              </MapView>
            </TouchableOpacity>
          )}
      
          onSwiped={(index: number) => console.log('Swiped index:', index)}
          onSwipedAll={() => {
            console.log('All cards swiped');
            setAllSwiped(true);
          }}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          
          // 🔥 Native Stack Effect
          stackSize={3}
          showSecondCard={true}
          stackSeparation={20}
          stackScale={6}
          animateCardOpacity={true}
          disableTopSwipe
          disableBottomSwipe
          backgroundColor="transparent"
          animateOverlayLabelsOpacity={true}

          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: 24,
                  opacity: 0.8,
                  transform: [{ scale: 1 }],
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: -25,
                  marginLeft: -35,
                },
              },
            },
            right: {
              title: 'GO',
              style: {
                label: {
                  backgroundColor: 'green',
                  color: 'white',
                  fontSize: 24,
                  opacity: 0.8,
                  transform: [{ scale: 1 }],
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: -25,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      )}

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailModalVisible}
        onRequestClose={closeCardDetails}
      >
        <ScrollView style={styles.modalContainer}>
          {selectedCard && (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeCardDetails} style={styles.closeButton}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedCard.title}</Text>
              </View>

              <View style={styles.modalContent}>
                {/* Location and Distance */}
                <View style={styles.locationSection}>
                  <View style={styles.row}>
                    <Feather name="map-pin" size={18} color="#333" style={styles.icon} />
                    <Text style={styles.modalLocationText}>{selectedCard.location}</Text>
                  </View>
                  <View style={styles.row}>
                    <Feather name="navigation" size={18} color="#333" style={styles.icon} />
                    <Text style={styles.modalDistanceText}>{selectedCard.distance}</Text>
                  </View>
                </View>

                {/* Rating and Reviews */}
                <View style={styles.ratingSection}>
                  <View style={styles.starsContainer}>
                    {renderStars(selectedCard.rating)}
                    <Text style={styles.ratingText}>{selectedCard.rating}</Text>
                  </View>
                  <Text style={styles.reviewsText}>({selectedCard.reviews} reviews)</Text>
                </View>

                {/* Description */}
                <Text style={styles.descriptionText}>{selectedCard.description}</Text>

                {/* Key Info */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Feather name="dollar-sign" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Price</Text>
                    <Text style={styles.infoValue}>{selectedCard.price}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Feather name="clock" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoValue}>{selectedCard.duration}</Text>
                  </View>
                </View>

                {/* Hours */}
                <View style={styles.hoursSection}>
                  <Text style={styles.sectionTitle}>Hours</Text>
                  <Text style={styles.hoursText}>{selectedCard.openHours}</Text>
                </View>

                {/* Vibes */}
                <View style={styles.vibesSection}>
                  <Text style={styles.sectionTitle}>Vibes</Text>
                  <View style={styles.modalVibePillsContainer}>
                    {selectedCard.vibes.map((vibe: string) => (
                      <View key={vibe} style={styles.modalVibePill}>
                        <Text style={styles.modalVibePillText}>{vibe}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featuresSection}>
                  <Text style={styles.sectionTitle}>Features</Text>
                  {selectedCard.features.map((feature: string, index: number) => (
                    <View key={index} style={styles.featureItem}>
                      <Feather name="check" size={16} color="#4CAF50" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Friends */}
                {selectedCard.friends && selectedCard.friends.length > 0 && (
                  <View style={styles.friendsSection}>
                    <Text style={styles.sectionTitle}>Friends who visited</Text>
                    <View style={styles.modalFriendsContainer}>
                      {selectedCard.friends.map((friend: Friend) => (
                        <View key={friend.username} style={styles.modalFriendItem}>
                          <Image source={friend.avatar} style={styles.modalFriendAvatar} />
                          <Text style={styles.modalFriendName}>{friend.username}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Map */}
                <View style={styles.mapSection}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.modalMap}
                    initialRegion={{
                      latitude: 43.65107,       
                      longitude: -79.347015,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                  >
                    <Marker
                      coordinate={{
                        latitude: 43.65107,
                        longitude: -79.347015,
                      }}
                      title={selectedCard.title}
                      description={selectedCard.location}
                    />
                  </MapView>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  card: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginTop: -55, //adjusts the heigh of the card
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
    flex: 0.6,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  details: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  icon: {
    marginRight: 8,
  },

  map: {
    width: '100%',
    height: 250,
    borderRadius: 30,
    overflow: 'hidden',
  }, 

  vibePillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  vibePill: {
    backgroundColor: 'rgba(100, 150, 240, 0.2)', // light pastel blue
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 0,
  },

  vibePillText: {
    fontSize: 12,
    color: '#264653', // dark teal blue
    fontWeight: '600',
  },

  resetButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },

  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },

  emptyState: {
    paddingTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
  },

  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },

  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },

  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  friendText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  closeButton: {
    padding: 5,
    marginRight: 15,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },

  modalContent: {
    padding: 20,
  },

  locationSection: {
    marginBottom: 15,
  },

  modalLocationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  modalDistanceText: {
    fontSize: 16,
    color: '#666',
  },

  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },

  reviewsText: {
    fontSize: 14,
    color: '#666',
  },

  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },

  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 5,
  },

  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },

  hoursSection: {
    marginBottom: 20,
  },

  hoursText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  vibesSection: {
    marginBottom: 20,
  },

  modalVibePillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  modalVibePill: {
    backgroundColor: 'rgba(100, 150, 240, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  modalVibePillText: {
    fontSize: 14,
    color: '#264653',
    fontWeight: '600',
  },

  featuresSection: {
    marginBottom: 20,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },

  friendsSection: {
    marginBottom: 20,
  },

  modalFriendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  modalFriendItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },

  modalFriendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },

  modalFriendName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },

  mapSection: {
    marginBottom: 20,
  },

  modalMap: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default DeckSwiper;