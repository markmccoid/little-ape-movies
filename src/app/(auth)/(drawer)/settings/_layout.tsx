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
      <Stack.Screen name="savedfiltersroute" />
      <Stack.Screen name="quicksortroute" />
    </Stack>
  );
};

export default SettingsLayout;
