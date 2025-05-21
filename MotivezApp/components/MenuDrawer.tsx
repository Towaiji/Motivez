import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

// This component is a sliding menu drawer that appears from the left side of the screen.
export default function MenuDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [drawerMounted, setDrawerMounted] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;


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
        toValue: -SCREEN_WIDTH,
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
        // Close button
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={33} color="#333" />    
        </TouchableOpacity>                                   

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
    zIndex: 9999,
  },
  backdropTouchArea: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "#fff",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 100
  },
});
