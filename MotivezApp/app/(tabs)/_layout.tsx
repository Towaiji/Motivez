import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import CustomAnimatedTabBar from "../../components/CustomAnimatedTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomAnimatedTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
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
  );
}
