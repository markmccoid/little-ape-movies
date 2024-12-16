import React from "react";
import { Stack } from "expo-router";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";

const SettingsLayout = () => {
  return (
    <Stack>
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
