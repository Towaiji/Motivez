// components/CarouselRow.tsx or inside motives.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
} from "react-native";
import { BlurView } from "expo-blur"; // Ensure you have expo-blur installed
import { LinearGradient } from "expo-linear-gradient"; // Ensure you have expo-linear-gradient installed

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

type Activity = {
  id: string;
  title: string;
  image: string; // for remote URLs
  description?: string;
};



export default function CarouselRow({title, data,}: {title: string; data: Activity[]}) {
  const scrollX = useRef(new Animated.Value(0)).current;

    const carouselData: (Activity | { id: string})[] = [
    { id: "left-spacer" },
    ...data,
    { id: "right-spacer" },
  ];

  return (
     <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 16, marginBottom: 8 }}>
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
            // It's a spacer object
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
            <Animated.View style={[styles.shadowContainer, { transform: [{ scale }], opacity }]}>
            <View style={styles.card}>
                <Image source={{ uri: activityItem.image }} style={styles.image} />
                <BlurView intensity={50} tint="dark" style={styles.overlay}>
                <LinearGradient
                    colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.1)", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={{ position: "relative" }}>
                    <Text style={styles.eventTitle}>{activityItem.title}</Text>
                    {activityItem.description && (
                    <Text style={styles.description}>{activityItem.description}</Text>
                    )}
                </View>
                </BlurView>
            </View>
            </Animated.View>
        );
        }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: 180,
    marginHorizontal: 2,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6, // Android
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
  //borderTopWidth: 1,
  //borderTopColor: "rgba(255,255,255,0.1)",
},

eventTitle: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

description: {
  color: "#ddd",
  fontSize: 14,
  marginTop: 2,
},
shadowContainer: {
  width: ITEM_WIDTH,
  marginHorizontal: 0,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8, // Android
},

});
