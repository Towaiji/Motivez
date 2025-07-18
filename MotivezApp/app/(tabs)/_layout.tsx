import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet, Platform, StatusBar, Animated } from "react-native";
import CustomAnimatedTabBar from "../../components/CustomAnimatedTabBar";
import { useState } from "react";
import MenuDrawer from "../../components/MenuDrawer";
import { useScroll } from "../context/ScrollContext";
import { useDevAuth } from "../../hooks/useDevAuth";
import { useTheme } from "../../lib/ThemeContext";
import { getColors } from "../../lib/colors";

export default function TabsLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const colors = getColors(theme);

  
  useDevAuth(); // This will log in the test user during dev


  // Tab bar animation with slower timing
  const tabBarTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const tabBarOpacity = scrollY.interpolate({
    inputRange: [0, 75],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 👤 Floating User Icon (no white box) */}
      <TouchableOpacity
        onPress={() => setMenuVisible((prev) => !prev)}
        style={styles.floatingIcon}
      >
        <Ionicons name="person-circle-outline" size={40} color={colors.text} />
      </TouchableOpacity>

      <Tabs
        tabBar={(props) => (
          <Animated.View
            style={[
              styles.tabBarContainer,
              {
                transform: [{ translateY: tabBarTranslateY }],
                opacity: tabBarOpacity,
              },
            ]}
          >
            <CustomAnimatedTabBar {...props} />
          </Animated.View>
        )}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        {/* 🃏 CardSwiper */}
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "Motivez",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log("Add Friend pressed")}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="person-add-outline" size={30} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* ➕ Create Post */}
        <Tabs.Screen
          name="create-motive"
          options={{
            headerTitle: "Create Motive",
          }}
        />

        {/* 🔍 Search */}
        <Tabs.Screen
          name="motives"
          options={{
            headerTitle: "Find Motivez",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log("Add Friend pressed")}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="person-add-outline" size={30} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      {/* 🗂️ Menu Drawer */}
      <MenuDrawer isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fffdf8",
  },
  floatingIcon: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 30) + 10 : 60,
    left: 15,
    zIndex: 100,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});