import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

const Page1Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[movieId]" />
      <Stack.Screen name="subpage2" />
    </Stack>
  );
};

export default Page1Layout;
