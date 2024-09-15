import { View, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const Settings = () => {
  const { currentUser: user, onLogout } = useAuth();
  const colorScheme = useColorScheme();
  return (
    <View>
      <Text className="text-text">Settings for {user}</Text>
      <Text className="text-text font-semibold">Color Scheme {colorScheme}</Text>
      <Link href="/(auth)/(drawer)/settings/settingone">
        <Text>Setting Page 1</Text>
      </Link>
      <Pressable onPress={() => onLogout()}>
        <Text>Log Out</Text>
      </Pressable>
    </View>
  );
};

export default Settings;
