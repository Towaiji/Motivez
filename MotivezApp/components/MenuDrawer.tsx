import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity, } from "react-native";

export default function MenuDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const [drawerMounted, setDrawerMounted] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setDrawerMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setDrawerMounted(false); // safely unmount after close animation
      });
    }
  }, [isVisible]);

  if (!drawerMounted) return null;

  return (
    <View style={styles.drawerWrapper}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdropTouchArea} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <View style={styles.fadeOverlay}>
          <View style={{ width: 20, backgroundColor: "#fff", opacity: 1 }} />
          <View style={{ width: 20, backgroundColor: "#fff", opacity: 0.7 }} />
          <View style={{ width: 20, backgroundColor: "#fff", opacity: 0.4 }} />
          <View style={{ width: 20, backgroundColor: "#fff", opacity: 0.1 }} />
        </View>

        <View style={styles.drawerContent}>
          <Text style={styles.drawerItem}>Profile</Text>
          <Text style={styles.drawerItem}>Settings</Text>
          <Text style={styles.drawerItem}>Saved</Text>
          <Text style={styles.drawerItem}>Logout</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: "row",
  },
  backdropTouchArea: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 250,
    backgroundColor: "#fff",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  fadeOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: "row",
    zIndex: 1,
  },
  drawerContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  drawerItem: {
    fontSize: 18,
    marginBottom: 20,
  },
});
