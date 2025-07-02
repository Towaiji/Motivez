import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

type Activity = {
  id: string;
  title: string;
  image: string;
  description?: string;
};

export default function CarouselRow({
  title, 
  data,
}: {
  title: string; 
  data: Activity[]
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  const carouselData: (Activity | { id: string})[] = [
    { id: "left-spacer" },
    ...safeData,
    { id: "right-spacer" },
  ];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleCardPress = (activityItem: Activity) => {
    router.push({
      pathname: "/motive-detail",
      params: {
        id: activityItem.id,
        title: activityItem.title,
        description: activityItem.description || '',
        image: activityItem.image,
      },
    });
  };

  return (
    <View style={{ marginBottom: 35 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 16, marginBottom: 19 }}>
        {title}
      </Text>

      <Animated.FlatList
        data={carouselData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!("title" in item && "image" in item)) {
            return <View style={{ width: SPACER_WIDTH }} />;
          }

          const activityItem = item as Activity;

          const inputRange = [
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => handleCardPress(activityItem)}
            >
              <Animated.View style={[
                styles.card,
                {
                  transform: [
                    { scale: Animated.multiply(scale, scaleAnim) }
                  ],
                  opacity
                }
              ]}>
                <Image 
                  source={{ uri: activityItem.image }} 
                  style={styles.image}
                />
                <View style={styles.overlay}>
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.9)",
                      "rgba(0,0,0,0.6)",
                      "rgba(0,0,0,0.3)",
                      "rgba(0,0,0,0)",
                    ]}
                    style={[StyleSheet.absoluteFill, { transform: [{ rotate: "180deg" }] }]}
                  />
                  <View style={{ position: "relative", zIndex: 2 }}>
                    <Text style={styles.eventTitle}>{activityItem.title}</Text>
                    {activityItem.description && (
                      <Text style={styles.description}>{activityItem.description}</Text>
                    )}
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: 300,
    marginHorizontal: 2,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});