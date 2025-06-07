import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "~/src/providers/AuthProvider";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)"></Redirect>
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black", tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
          // headerShown: false,
          headerTitle: "For You",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="new"
        options={{
          headerTitle: "New Post",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square-o" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="search"
        options={{
          headerTitle: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="saved"
        options={{
          headerTitle: "Library",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bookmark" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
