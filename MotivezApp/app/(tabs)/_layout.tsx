import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import CustomAnimatedTabBar from "../../components/CustomAnimatedTabBar";
import {  useState } from "react";
import MenuDrawer from "../../components/MenuDrawer";

export default function TabsLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
    <Tabs
      tabBar={(props) => <CustomAnimatedTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible((prev) => !prev)}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="person-circle-outline" size={40} color="black" />
            </TouchableOpacity>
          ),
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
              <Ionicons name="person-add-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
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

      {/* ➕ Create Post */}
      <Tabs.Screen
        name="create-motive"
        options={{
          headerTitle: "Create Motive",
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
  },
});