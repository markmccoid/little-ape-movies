import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
const HomeLayout = () => {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerStyle: { backgroundColor: colors.card } }} />
      <Stack.Screen name="[showId]" options={{ headerTransparent: true, title: "" }} />
      <Stack.Screen name="filtermodal" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default HomeLayout;
