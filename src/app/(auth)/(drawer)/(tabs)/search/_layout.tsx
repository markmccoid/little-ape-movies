import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[movieId]" />
      <Stack.Screen name="personmovies/[personId]" />
    </Stack>
  );
};

export default SearchLayout;
