import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";

const Page3 = () => {
  const { colors } = useTheme();

  return (
    <View className="">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />

      <Text>Tags</Text>
    </View>
  );
};

export default Page3;
