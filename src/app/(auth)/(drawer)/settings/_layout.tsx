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
        }}
      />
      <Stack.Screen name="settingone" />
    </Stack>
  );
};

export default SettingsLayout;
