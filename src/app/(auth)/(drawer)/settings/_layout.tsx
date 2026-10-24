import React from "react";
import { Stack } from "expo-router";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import { useCustomTheme } from "@/lib/colorThemes";

const SettingsLayout = () => {
  const { colors } = useCustomTheme();
  return (
    <Stack
      screenOptions={{
        // iOS 26+ defaults to a transparent Liquid Glass header and lays the
        // screen underneath it. Keep the bar opaque so settings start below it.
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <NestedStackDrawerToggle />,
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="savedfiltersroute"
        options={{
          title: "Saved Filters",
        }}
      />
      <Stack.Screen
        name="quicksortroute"
        options={{
          title: "Quick Sorts",
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
