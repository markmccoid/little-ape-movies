import { View, Text, Pressable } from "react-native";
import React, { useReducer, useState } from "react";
import { Link, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import TagMaintContainer from "@/components/tagMaintenance/TagMaintContainer";
import { PlusCircle } from "@/lib/icons/PlusCircle";
import TagTest from "@/components/tagMaintenance/TagTest";

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

      {/* <TagTest /> */}
      <TagMaintContainer />
    </View>
  );
};

export default TagRoute;
