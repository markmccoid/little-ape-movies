import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Search" }} />
      <Stack.Screen
        name="[showId]"
        options={{ headerShown: false }}
        // getId={({ params }) => params.showId}
      />

      <Stack.Screen name="personmovies/[personId]" />
    </Stack>
  );
};

export default SearchLayout;
