import { View, Text, Pressable } from "react-native";
import React, { useReducer, useState } from "react";
import { Link, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import TagContainer from "@/components/tags/TagContainer";
import { PlusCircle } from "@/lib/icons/PlusCircle";
import TagTest from "@/components/tags/TagTest";

const TagRoute = () => {
  const { colors } = useTheme();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />

      {/* <TagTest /> */}
      <TagContainer />
    </View>
  );
};

export default TagRoute;
