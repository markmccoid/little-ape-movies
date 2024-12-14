import { View, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import SettingsContainer from "@/components/settings/SettingsContainer";

const Settings = () => {
  return (
    <View className="flex-1">
      <SettingsContainer />
    </View>
  );
};

export default Settings;
