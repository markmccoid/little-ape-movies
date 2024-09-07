import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";

const Page2 = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Search",
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />
      <Text>Page2</Text>
      <Link href="/(auth)/(drawer)/(tabs)/search/subpage2">
        <Text>SubPage 2</Text>
      </Link>
      <Link href="/(auth)/(drawer)/(tabs)/search/25">
        <Text>Detail</Text>
      </Link>
    </View>
  );
};

export default Page2;
