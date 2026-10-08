import { View, Text, Pressable } from "react-native";
import React, { useReducer, useState } from "react";
import { Link, Stack, useTheme } from "expo-router";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import TagMaintContainer from "@/components/tagMaintenance/TagMaintContainer";
import { PlusCircle } from "@/lib/icons/PlusCircle";
const TagRoute = () => {
  const { colors } = useTheme();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Tags",
          headerShown: true,
          headerLeft: () => <NestedStackDrawerToggle />,
        }}
      />

      <TagMaintContainer />
    </View>
  );
};

export default TagRoute;
