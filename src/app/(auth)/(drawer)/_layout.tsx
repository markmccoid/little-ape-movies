import { View, Text } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../../../components/drawer/CustomDrawer";

const Layout = () => {
  return (
    <Drawer
      screenOptions={{ headerShown: false, drawerContentContainerStyle: { margin: 0, padding: 0 } }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
};

export default Layout;
