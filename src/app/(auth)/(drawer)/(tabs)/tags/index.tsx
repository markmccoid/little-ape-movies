import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import Temp from "@/components/common/animations/Temp";
const Page3 = () => {
  const { colors } = useTheme();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />

      <Temp />
    </View>
  );
};

export default Page3;
