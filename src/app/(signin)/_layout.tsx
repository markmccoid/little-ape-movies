import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import { useCustomTheme } from "@/utils/colorThemes";
const SignInLayout = () => {
  const { colors } = useCustomTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Little Ape Movies" }} />
    </Stack>
  );
};

export default SignInLayout;
