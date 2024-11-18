import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const SearchLayout = ({ segment }) => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Search" }} />
      <Stack.Screen
        name="[showId]"
        options={{ headerTransparent: false, title: "" }}
        getId={({ params }) => params.showId}
      />

      <Stack.Screen name="personmovies/[personId]" />
    </Stack>
  );
};

export default SearchLayout;
