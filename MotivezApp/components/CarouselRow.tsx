import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { SharedElement } from 'react-navigation-shared-element';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

type Activity = {
  id: string;
  title: string;
  image: string;
  description?: string;
};

// Define your navigation types
type RootStackParamList = {
  tabs: undefined;
  detail: {
    id: string;
    title: string;
    description?: string;
    image: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function CarouselRow({title, data,}: {title: string; data: Activity[]}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const carouselData: (Activity | { id: string})[] = [
    { id: "left-spacer" },
    ...data,
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
              activeOpacity={1}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                router.push({
                  pathname: "/motive-detail",
                  params: {
                    id: activityItem.id,
                    title: activityItem.title,
                    description: activityItem.description,
                    image: activityItem.image,
                  },
                });
              }}
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
                <SharedElement 
                  id={`item.${activityItem.id}.photo`} 
                  style={StyleSheet.absoluteFill}
                >
                  <Image 
                    source={{ uri: activityItem.image }} 
                    style={styles.image}
                  />
                </SharedElement>
                <View style={styles.overlay}>
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.8)",
                      "rgba(0,0,0,0.4)",
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 6,
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 5,
  },
  shadowContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});