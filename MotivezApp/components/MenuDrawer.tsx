import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  const router = useRouter();

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
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchArea} />
        </TouchableWithoutFeedback>

        {/* Drawer */}
        {/* Animated drawer that slides in from the left */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={33} color="#333" />
          </TouchableOpacity>

          <View style={styles.drawerContent}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.profileName}>Hey, Mohammad 👋</Text>
                <Text style={styles.profileSubtitle}>Switch Profile</Text>
              </View>
            </View>

            {/* Drawer items */}
            <TouchableOpacity onPress={() => { router.push("/menu/profile"); }}>
              <Text style={styles.drawerItem}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { router.push("/menu/settings"); }}>
              <Text style={styles.drawerItem}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { router.push("/menu/saved"); }}>
              <Text style={styles.drawerItem}>Saved</Text>
            </TouchableOpacity>
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
    top: 50,
    right: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
});
