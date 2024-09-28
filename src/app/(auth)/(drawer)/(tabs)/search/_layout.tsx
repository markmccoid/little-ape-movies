import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[movieId]" options={{headerTransparent: true, title: ""}} />
      <Stack.Screen name="personmovies/[personId]" />
    </Stack>
  );
};

export default SearchLayout;
