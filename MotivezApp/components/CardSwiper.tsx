import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get('window');

interface Activity {
  id: string;
  title: string;
  address: string;
  distance: string;
  type: string;
  coords: {
    latitude: number;
    longitude: number;
  }
}

const MOCK_ACTIVITIES: Activity[] = [
    { id: "1", title: "Coffee Break", address: "123 Main St", distance: "2.3 km", type: "cafe" , coords: { latitude: 40.7128, longitude: -74.0060 } },
    { id: "2", title: "Morning Jog", address: "456 Park Ave", distance: "2.3 km", type: "cafe", coords: { latitude: 40.7306, longitude: -73.9352 } },
    { id: "3", title: "Art Exhibit", address: "789 Broadway", distance: "2.3 km", type: "cafe", coords: { latitude: 40.7580, longitude: -73.9855 } },
    { id: "4", title: "Dinner Date", address: "101 5th Ave", distance: "2.3 km", type: "cafe", coords: { latitude: 40.7411, longitude: -73.9897 } },
    { id: "5", title: "Movie Night", address: "202 42nd St", distance: "2.3 km", type: "cafe", coords: { latitude: 40.7587, longitude: -73.9787 } },
  ]

// Calculate card dimensions based on screen size
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.5;

export default function CardSwiper() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      <Swiper
        cards={MOCK_ACTIVITIES}
        renderCard={(card: Activity) => (
            <View style={styles.card} key={card.id}>
            {/* 1) Title row, centered but leaves room for NOPE/GO overlays */}
            <View style={styles.header}>
              <Text style={styles.title}>{card.title}</Text>
            </View>
        
            {/* 2) Address & price (smaller font) */}
          <View style={styles.info}>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color="black" style={styles.icon} />
              <Text style={styles.infoText}>{card.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome5 name="walking" size={16} color="black" style={styles.icon} />
              <Text style={styles.infoText}>{card.distance}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="category" size={16} color="black" style={styles.icon} />
              <Text style={styles.infoText}>{card.type}</Text>
            </View>
          </View>
        
            {/* 3) Mini map in bottom third */}
        <View style={styles.mapContainer}>
            <MapView
                provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude:   card.coords.latitude,
                longitude:  card.coords.longitude,
                latitudeDelta:  0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={card.coords} />
            </MapView>
          </View>
            </View>
        )}
        onSwiped={(i) => console.log('Swiped', i)}
        onSwipedAll={() => console.log('All done')}
        cardIndex={0}
        backgroundColor="transparent"

        //Stack configuration
        cardStyle={styles.cardContainer}
        stackSize={3}
        stackSeparation={15}
        stackScale={0.94}
        showSecondCard={true}
        infinite={true}
        animateCardOpacity={true}
        animateOverlayLabelsOpacity={true}
        swipeAnimationDuration={350}
        containerStyle={{ flex: 1}}
        // @ts-ignore
        wrapperStyle={styles.wrapper}

        // Swipe configuration
        verticalSwipe={false}
        horizontalSwipe={true}

        cardHorizontalMargin={(width - CARD_WIDTH) / 3}


        overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                wrapper: { alignItems: 'flex-end', paddingRight: 12, marginRight: 20, flexDirection: "column", justifyContent: "flex-start", marginTop: 20, },
                label: {
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: 24,
                  borderRadius: 8,
                  padding: 8,
                  overflow: 'hidden',
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 2,
                    },
                  }),
                },
              },
            },
            right: {
              title: 'GO',
              style: {
                wrapper: { alignItems: 'flex-start', marginLeft: 20, flexDirection: "column", justifyContent: "flex-start", marginTop: 20, },
                label: {
                  backgroundColor: 'green',
                  color: 'white',
                  fontSize: 24,
                  borderRadius: 8,
                  padding: 8,
                  overflow: 'hidden',
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 2,
                    },
                  }),
                },
              },
            },
          }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', //fixed width to prevent overflow
    height: '100%',
    padding: 10,
  },
  swiperContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',     
    justifyContent: 'center', 
  },
    /*swiperInner: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: CARD_WIDTH,
        height: CARD_HEIGHT + 60,
        flex: 1,
    }, */
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
        },
        android: {
            elevation: 10,
        },
        }),
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 20,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          },
          android: {
            elevation: 10,
          },
        }),
      },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  desc: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  header: {
    height: CARD_HEIGHT * 0.15,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginTop: 30,
    paddingHorizontal: 3,
    textAlign: 'left',
  },
  info: {
    height: CARD_HEIGHT * 0.15,
    paddingLeft: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  address: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  map: {
    flex: 1,
  },
    mapContainer: {
        width: '100%',
        marginTop: 20,
        flex: 1,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
      },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
  icon: {
    marginRight: 10,
  },
});