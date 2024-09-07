import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
const SignInLayout = () => {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Little Ape Movies" }} />
      <Stack.Screen
        name="register"
        options={{ title: "Little Ape Movies Register", headerBackTitle: "Login" }}
      />
    </Stack>
  );
};

export default SignInLayout;
