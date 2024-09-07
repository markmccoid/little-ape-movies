import React from "react";
import { Tabs } from "expo-router";
import { Alert } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "home",
};
const Layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={25} color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={25} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
