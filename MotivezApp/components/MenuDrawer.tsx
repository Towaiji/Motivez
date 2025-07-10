// components/MenuDrawer.tsx

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomAccountDrawer from "./BottomAccountDrawer";
import { useTheme } from '../lib/ThemeContext';
import { getColors } from '../lib/colors';

const SCREEN_WIDTH = Dimensions.get("window").width;

// Dummy accounts for demonstration (replace with real data)
const DUMMY_ACCOUNTS = [
  { id: "1", name: "@motive_user", avatarUri: "https://i.pravatar.cc/100?u=motive_user" },
  { id: "2", name: "@john_doe",    avatarUri: "https://i.pravatar.cc/100?u=john_doe"    },
  { id: "3", name: "@jane_smith",  avatarUri: "https://i.pravatar.cc/100?u=jane_smith"  },
];

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isVisible, onClose }: MenuDrawerProps) {
  // Keep the drawer mounted until its "slide-out" animation completes
  const [drawerMounted, setDrawerMounted] = useState(isVisible);
  const [bottomVisible, setBottomVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);

  useLayoutEffect(() => {
    if (isVisible) {
      // Mount first, then slide in
      setDrawerMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Slide out, then unmount at end
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setDrawerMounted(false);
      });
    }
  }, [isVisible]);

  // If nothing is mounted, render nothing
  if (!drawerMounted) return null;

  const styles = StyleSheet.create({
    drawerWrapper: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    drawer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: SCREEN_WIDTH * 0.8,
      backgroundColor: colors.drawerBg,
      zIndex: 10,
      shadowColor: colors.drawerShadow,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    drawerContent: {
      paddingTop: 100,
      paddingHorizontal: 20,
      paddingBottom: 40, // Add some bottom padding to avoid cut‐off content
    },
    closeButton: {
      position: "absolute",
      top: 50,
      right: 20,
      backgroundColor: colors.drawerCloseBg,
      borderRadius: 20,
      padding: 6,
      shadowColor: colors.drawerShadow,
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
      color: colors.drawerProfileName,
    },
    profileSubtitle: {
      fontSize: 14,
      color: colors.drawerProfileSubtitle,
      marginTop: 4,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 20,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.drawerDivider,
      marginVertical: 20,
    },
    drawerItemRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    drawerItemText: {
      marginLeft: 14,
      fontSize: 18,
      color: colors.drawerItemText,
    },
    logoutRow: {
      marginTop: 16,
    },
  });

  return (
    <>
      {/* Full-screen wrapper, including backdrop */}
      <View style={styles.drawerWrapper}>
        {/* Backdrop: clicking it closes the drawer */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Animated drawer sliding in/out from left */}
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Close “X” button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={33} color={colors.drawerCloseIcon} />
          </TouchableOpacity>

          {/* Wrap all menu items in a ScrollView */}
          <ScrollView contentContainerStyle={styles.drawerContent}>
            {/* ==== 1) User Account Section ==== */}
            <View style={styles.profileSection}>
              <Image
                source={{ uri: DUMMY_ACCOUNTS[0].avatarUri }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.profileName}>Hey, Mohammad 👋</Text>
                <TouchableOpacity onPress={() => setBottomVisible(true)}>
                  <Text style={styles.profileSubtitle}>Switch Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* “Profile” */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/profile");
                onClose();
              }}
            >
              <Ionicons name="person-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Profile</Text>
            </TouchableOpacity>

            {/* “My Motives” */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/my-motives");
                onClose();
              }}
            >
              <Ionicons name="list-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>My Motives</Text>
            </TouchableOpacity>

            {/* “Add / Invite Friends” */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                /* Launch your “Add Friends” flow here */
                onClose();
              }}
            >
              <Ionicons name="person-add-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Add / Invite Friends</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ==== 2) Social / Community Section ==== */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/friends");
                onClose();
              }}
            >
              <Ionicons name="people-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/messages");
                onClose();
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/saved");
                onClose();
              }}
            >
              <Ionicons name="bookmark-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Saved Motives</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ==== 3) Find & Discover Section ==== */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/explore");
                onClose();
              }}
            >
              <Ionicons name="compass-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Explore / Trending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/map");
                onClose();
              }}
            >
              <Ionicons name="map-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Nearby Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/categories");
                onClose();
              }}
            >
              <Ionicons name="pricetags-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Categories</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ==== 4) Your Plans / Calendar Section ==== */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/calendar");
                onClose();
              }}
            >
              <Ionicons name="calendar-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Upcoming Events</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/memories");
                onClose();
              }}
            >
              <Ionicons name="time-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Past Memories</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ==== 5) App Settings & Support Section ==== */}
            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/settings");
                onClose();
              }}
            >
              <Ionicons name="settings-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/notifications");
                onClose();
              }}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/help");
                onClose();
              }}
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Help & Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItemRow}
              onPress={() => {
                router.push("/menu/about");
                onClose();
              }}
            >
              <Ionicons name="information-circle-outline" size={22} color={colors.drawerItemIcon} />
              <Text style={styles.drawerItemText}>About Motivez</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ==== Log Out ==== */}
            <TouchableOpacity
              style={[styles.drawerItemRow, styles.logoutRow]}
              onPress={() => {
                /* Perform logout logic here */
                console.log("Logging out...");
              }}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.drawerLogoutIcon} />
              <Text style={[styles.drawerItemText, { color: colors.drawerLogout }]}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>

      {/* Bottom sheet for “Switch Profile” */}
      <BottomAccountDrawer
        isVisible={bottomVisible}
        onClose={() => setBottomVisible(false)}
        accounts={DUMMY_ACCOUNTS}
      />
    </>
  );
}
