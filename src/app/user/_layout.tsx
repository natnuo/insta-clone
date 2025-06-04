import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function UserLayout() {
  return (<Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "black",
    tabBarShowLabel: false
  }}>
    <Tabs.Screen
      name="index"
      options={{
        // headerShown: false,
        headerTitle: "Back",
        tabBarIcon: ({ color }) => (
          <Ionicons name="arrow-back" size={24} color={color} />
        ),
      }}
    ></Tabs.Screen>

    <Tabs.Screen
      name="[userId]"
      options={{
        // headerShown: false,
        headerTitle: "User",
        tabBarIcon: ({ color }) => (
          <AntDesign name="user" size={24} color={color} />
        ),
      }}
    ></Tabs.Screen>
  </Tabs>);
}
