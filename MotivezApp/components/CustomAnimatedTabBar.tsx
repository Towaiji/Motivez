import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const { width } = Dimensions.get("window");

const ICONS = [
  "custom-cards",
  "add-circle",
  "search",
];

export default function CustomAnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const TAB_BAR_WIDTH = 300;
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  const pillOffset = (TAB_WIDTH - TAB_WIDTH * 0.8) / 2;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH + pillOffset,
      useNativeDriver: true,
      bounciness: 10,
      speed: 15,
    }).start();
  }, [state.index]);

  return (
    <View style={[styles.container, { width: TAB_BAR_WIDTH }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: TAB_WIDTH * 0.8,
            transform: [{ translateX }],
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            {ICONS[index] === "custom-cards" ? (
              <MaterialCommunityIcons
                name="cards"
                size={32}
                color={isFocused ? "#e91e63" : "#aaa"}
              />
            ) : (
              <Ionicons
                name={ICONS[index] as any}
                size={32}
                color={isFocused ? "#e91e63" : "#aaa"}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 35,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  indicator: {
    position: "absolute",
    top: 10,
    height: 50,
    backgroundColor: "#ffe4ec",
    borderRadius: 25,
    zIndex: 0,
    left: 0,
  },
});