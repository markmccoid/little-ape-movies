import { View, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import SettingsContainer from "@/components/settings/SettingsContainer";
import { Stack } from "expo-router";
import HomeButton from "@/components/drawer/HomeButton";

const Settings = () => {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerRight: () => <HomeButton /> }} />
      <SettingsContainer />
    </View>
  );
};

export default Settings;
