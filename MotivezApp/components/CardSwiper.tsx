import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');

interface Activity {
  id: string;
  title: string;
  description: string;
}

const MOCK_ACTIVITIES: Activity[] = [
    { id: "1", title: "☕ Coffee Break", description: "Grab a latte at Central Perk" },
    { id: "2", title: "🏃 Morning Jog", description: "Run at Riverside Park" },
    { id: "3", title: "🎨 Art Exhibit", description: "Visit the Modern Art Museum" },
    { id: "4", title: "🍽️ Dinner Date", description: "Romantic dinner at Skylight Restaurant" },
    { id: "5", title: "🎬 Movie Night", description: "Watch the latest blockbuster" },
  ]

// Calculate card dimensions based on screen size
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.5;

export default function CardSwiper() {
  return (
    <View style={styles.container}>
      <Swiper
        cards={MOCK_ACTIVITIES}
        renderCard={(card: Activity) => (
          <View style={styles.card} key={card.id}>
            <Text style={styles.title}>{card.title}</Text>
            <Text style={styles.desc}>{card.description}</Text>
          </View>
        )}
        onSwiped={(i) => console.log('Swiped', i)}
        onSwipedAll={() => console.log('All done')}
        cardIndex={0}
        backgroundColor="transparent"
        //Stack configuration
        cardStyle={styles.cardContainer}
        stackSize={3}
        stackSeparation={22}
        stackScale={0.85}
        showSecondCard={true}
        infinite={true}
        animateCardOpacity={true}
        animateOverlayLabelsOpacity={true}
        swipeAnimationDuration={350}
        containerStyle={styles.swiperInner}
        overlayOpacityHorizontalThreshold={width / 5}
        // @ts-ignore
        wrapperStyle={styles.wrapper}
        verticalSwipe={false}
        horizontalSwipe={true}
        overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                wrapper: { alignItems: 'flex-end', marginRight: 20, flexDirection: "column", justifyContent: "flex-start", marginTop: 20, },
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
              title: 'GO!',
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
    position: "relative",
    zIndex: 1,
  },
    swiperInner: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: CARD_WIDTH,
        height: CARD_HEIGHT + 60,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center',
        justifyContent: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});