import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#fff7fe",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          padding: 10,
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: "#fff7fe",
        },
      }}>
      <Tabs.Screen name="index" options={{
        headerTitle: "Motivez",
        tabBarShowLabel: false,
        tabBarIcon: ({ color }) => (
          <Ionicons name="home" size={24} color={color} />
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Add Friend pressed")} style={{ marginRight: 15 }}>
            <Ionicons name="person-add-outline" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />
      <Tabs.Screen name="user" options={{
        headerTitle: "My Profile",
        tabBarShowLabel: false,
        tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
      }} />
      <Tabs.Screen name="motives" options={{
        headerTitle: "Find Motivez",
        tabBarShowLabel: false,
        tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
      }} />
      <Tabs.Screen name="+not-found" options={{
        headerTitle: "Not Found",
      }} />
    </Tabs>
  );
}
