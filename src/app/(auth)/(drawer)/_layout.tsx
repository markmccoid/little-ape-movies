import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";

const Layout = () => {
  return (
    <Drawer
      screenOptions={{ headerShown: false, drawerContentContainerStyle: { margin: 0, padding: 0 } }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
};

export default Layout;
