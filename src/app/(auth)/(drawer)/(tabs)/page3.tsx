import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";

const Page3 = () => {
  const { colors } = useTheme();
  return (
    <View className="mt-20">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor={colors.primary} />,
        }}
      />
      {/* <Stack.Screen options={{ headerShown: true, headerLeft: () => <DrawerToggleButton /> }} /> */}
      <Text>Page3</Text>
      <Link href="/(auth)/(drawer)/(tabs)/search/42" push>
        <Text>GO TO 42</Text>
      </Link>
    </View>
  );
};

export default Page3;
