import { View, Text } from "react-native";
import React from "react";
import QuickSortContainer from "@/components/settings/quickSorts/QuickSortContainer";
import { head } from "lodash";
import { Stack } from "expo-router";
import HomeButton from "@/components/drawer/HomeButton";

const QuickSortRoute = () => {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HomeButton /> }} />
      <QuickSortContainer />
    </>
  );
};

export default QuickSortRoute;
