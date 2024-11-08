import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useCustomTheme } from "@/lib/colorThemes";

const TagsLayout = () => {
  const { colors } = useCustomTheme();
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" options={{ headerStyle: { backgroundColor: colors.card } }} />
    </Stack>
  );
};

export default TagsLayout;
