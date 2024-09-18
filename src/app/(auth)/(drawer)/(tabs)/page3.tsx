import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { usePageSearch } from "@/store/query.search";
import { TouchableOpacity } from "react-native-gesture-handler";

const Page3 = () => {
  const { colors } = useTheme();

  // const { movies, fetchNextPage } = usePageSearch();
  // console.log("movies", movies);
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
      {/* <TouchableOpacity onPress={fetchNextPage}>
        <Text>Next Page</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Page3;
