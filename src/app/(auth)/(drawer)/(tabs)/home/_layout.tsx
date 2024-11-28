import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
const HomeLayout = () => {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerStyle: { backgroundColor: colors.card } }} />
      <Stack.Screen
        name="[showId]"
        options={{ headerShown: false }}
        // getId={({ params }) => params.showId}
      />
      <Stack.Screen name="filtermodal" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
