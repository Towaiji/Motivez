// components/MenuDrawer.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomAccountDrawer from "./BottomAccountDrawer";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Sample accounts that have logged in
const DUMMY_ACCOUNTS = [
  {
    id: "1",
    name: "@motive_user",
    avatarUri: "https://i.pravatar.cc/100?u=motive_user",
  },
  {
    id: "2",
    name: "@john_doe",
    avatarUri: "https://i.pravatar.cc/100?u=john_doe",
  },
  {
    id: "3",
    name: "@jane_smith",
    avatarUri: "https://i.pravatar.cc/100?u=jane_smith",
  },
];

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isVisible, onClose }: MenuDrawerProps) {
  const [drawerMounted, setDrawerMounted] = useState(isVisible);
  const [bottomVisible, setBottomVisible] = useState(false);
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
        setDrawerMounted(false);
      });
    }
  }, [isVisible]);

  if (!drawerMounted) return null;

  return (
    <>
      {/* Left‐side Drawer */}
      <View style={styles.drawerWrapper}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchArea} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={33} color="#333" />
          </TouchableOpacity>

          <View style={styles.drawerContent}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <Image
                source={{ uri: DUMMY_ACCOUNTS[0].avatarUri }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.profileName}>Hey, Mohammad 👋</Text>
                {/* Switch Profile opens the bottom drawer */}
                <TouchableOpacity
                  onPress={() => setBottomVisible(true)}
                >
                  <Text style={styles.profileSubtitle}>Switch Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Drawer Items */}
            <TouchableOpacity
              onPress={() => {
                router.push("/menu/profile");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/settings");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/saved");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Saved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/notifications");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/help");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/calendar");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/friends");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/menu/groups");
                onClose();
              }}
            >
              <Text style={styles.drawerItem}>Groups</Text>
            </TouchableOpacity>



            <TouchableOpacity onPress={() => console.log("Logout tapped")}>
              <Text style={styles.drawerItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Drawer for switching profiles */}
      <BottomAccountDrawer
        isVisible={bottomVisible}
        onClose={() => setBottomVisible(false)}
        accounts={DUMMY_ACCOUNTS}
      />
    </>
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
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.8, // Make it 80% of screen width
    backgroundColor: "#fff",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 2,
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
    color: "#aaa",
    marginTop: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  drawerItem: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
});
