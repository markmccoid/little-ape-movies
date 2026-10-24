import React from "react";
import { Stack } from "expo-router";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import { useCustomTheme } from "@/lib/colorThemes";
import { useMovies } from "@/store/store.shows";
const HomeLayout = () => {
  const { filteredCount, isLoading } = useMovies();
  const { colors } = useCustomTheme();
  return (
    <Stack
      screenOptions={{
        // iOS 26+ defaults to a transparent Liquid Glass header and lays the
        // screen underneath it. Keep the bar opaque so the grid starts below it.
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: isLoading ? "Movies" : `${filteredCount} Movies`,
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
