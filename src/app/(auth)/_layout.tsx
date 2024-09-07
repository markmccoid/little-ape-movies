import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import useMovieStore from "@/store/movieStore";
import { getCurrentUser } from "@/store/localStorage-users";

const AuthLayout = () => {
  React.useEffect(() => {
    console.log("Auth Login", getCurrentUser());
    return () => console.log("Auth LOGOUT", getCurrentUser());
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false, title: "Movies" }} />
      {/* <Stack.Screen name="detail" options={{}} /> */}
    </Stack>
  );
};

export default AuthLayout;
