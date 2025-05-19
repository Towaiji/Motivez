import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import CustomAnimatedTabBar from "../../components/CustomAnimatedTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomAnimatedTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Motivez",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => console.log("Add Friend pressed")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="person-add-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="motives"
        options={{
          headerTitle: "Find Motivez",
        }}
      />
      <Tabs.Screen
        name="create-motive"
        options={{
          headerTitle: "Create Motive",
        }}
      />
      <Tabs.Screen
        name="maps/index"
        options={{
          headerTitle: "Map",
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerTitle: "My Profile",
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16, marginRight: 15 }}>
              <TouchableOpacity onPress={() => console.log("Calendar tapped")}>
                <Ionicons name="calendar-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Settings tapped")}>
                <Ionicons name="menu-outline" size={26} color="#333" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
