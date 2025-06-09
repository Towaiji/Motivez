import { transform } from '@babel/core';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Mock data (can expand this list later)
const cards = [
  { id: '1', title: 'Axe Throwing', location: 'Downtown Arena', distance: '3.2 km', vibes: ['Adventure', 'Fun'] },
  { id: '2', title: 'Board Game Cafe', location: 'Queen Street', distance: '1.5 km', vibes: ['Relaxing', 'Social'] },
  { id: '3', title: 'Art Gallery', location: 'King & Spadina', distance: '2.1 km', vibes: ['Cultural', 'Inspiring'] },
  { id: '4', title: 'Escape Room', location: 'Bay & Dundas', distance: '4.0 km', vibes: ['Mystery', 'Teamwork'] },
  { id: '5', title: 'Jazz Night', location: 'Harbourfront Centre', distance: '2.8 km', vibes: ['Music', 'Chill'] },
];

const DeckSwiper = () => {
  const swiperRef = useRef(null);

  const handleSwipeRight = (index: number) => {
    console.log('Liked:', cards[index]?.title);
    // Placeholder for future backend logging
    // sendSwipeToBackend(cards[index], 'like')
  };

  const handleSwipeLeft = (index: number) => {
    console.log('Skipped:', cards[index]?.title);
    // Placeholder for future backend logging
    // sendSwipeToBackend(cards[index], 'skip')
  };

  const [allSwiped, setAllSwiped] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);

  const resetDeck = () => {
    setAllSwiped(false);
    setSwiperKey(prev => prev + 1); // Force re-render of swiper
  };

    return (
    <View style={styles.container}>
        {allSwiped ? ( // Show a message when all cards are swiped
          <View style={styles.card}>
            <Text style={styles.title}>You're all caught up!</Text>
            <Text style={styles.details}>Come back later for more activities</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetDeck}>
              <Text style={styles.resetButtonText}>Reset Deck</Text>
            </TouchableOpacity>
          </View>
        ) : (
        <Swiper
            key={swiperKey} // Force re-render when reset
            ref={swiperRef}
            cards={cards}
            renderCard={(card) => (
              <View style={styles.card}>
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
                  {card.vibes.map((vibe) => (
                    <View key={vibe} style={styles.vibePill}>
                      <Text style={styles.vibePillText}>{vibe}</Text>
                    </View>
                  ))}
                </View>

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
              </View>
            )}
        
        onSwiped={(index) => console.log('Swiped index:', index)}
        onSwipedAll={() => {
            console.log('All cards swiped');
            setAllSwiped(true);
        }}
        onSwipedRight={handleSwipeRight}
        onSwipedLeft={handleSwipeLeft}
        
        // 🔥 Native Stack Effect
        stackSize={3}
        showSecondCard={true}
        stackSeparation={14}
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
    marginTop: -40, //adjusts the heigh of the card
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
    marginTop: 20,
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
  marginBottom: 6,
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
});

export default DeckSwiper;