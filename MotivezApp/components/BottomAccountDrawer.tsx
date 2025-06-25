// components/BottomAccountDrawer.tsx
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
import { useTheme } from "../app/context/ThemeContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomAccountDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  accounts: { id: string; name: string; avatarUri: string }[];
}

export default function BottomAccountDrawer({
  isVisible,
  onClose,
  accounts,
}: BottomAccountDrawerProps) {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  const [mounted, setMounted] = useState(isVisible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <View style={styles.wrapper}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        {/* Title */}
        <Text style={styles.title}>Switch Profile</Text>

        {/* Account List */}
        {accounts.map((acct) => (
          <TouchableOpacity
            key={acct.id}
            style={styles.accountRow}
            onPress={() => {
              // You can implement account‐switch logic here
              console.log("Switch to:", acct.name);
              onClose();
            }}
          >
            <Image source={{ uri: acct.avatarUri }} style={styles.avatar} />
            <Text style={styles.accountName}>{acct.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Sign in with new account */}
        <TouchableOpacity
          style={styles.newAccountRow}
          onPress={() => {
            console.log("Navigate to sign‐in screen");
            onClose();
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={darkMode ? "#eee" : "#333"}
          />
          <Text style={styles.newAccountText}>Sign in with another account</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const getStyles = (darkMode: boolean) => StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: darkMode ? "#181818" : "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    // Elevation/shadow for iOS & Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    backgroundColor: darkMode ? "#555" : "#ccc",
    borderRadius: 2.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: darkMode ? "#eee" : "#333",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  accountName: {
    fontSize: 16,
    color: darkMode ? "#eee" : "#333",
  },
  divider: {
    height: 1,
    backgroundColor: darkMode ? "#333" : "#ececec",
    marginVertical: 16,
  },
  newAccountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  newAccountText: {
    marginLeft: 10,
    fontSize: 16,
    color: darkMode ? "#eee" : "#333",
  },
});
