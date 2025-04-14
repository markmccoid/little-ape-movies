import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import { getCurrentUser } from "@/store/dataAccess/localStorage-users";
import { useMovies } from "@/store/store.shows";
const HomeLayout = () => {
  const { filteredCount } = useMovies();
  const currUser = getCurrentUser();
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: `${filteredCount} Movies`,
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />
      <Stack.Screen
        name="[showId]"
        options={{ headerShown: false }}
        getId={({ params }) => params?.showId}
      />
      <Stack.Screen name="filtermodal" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
