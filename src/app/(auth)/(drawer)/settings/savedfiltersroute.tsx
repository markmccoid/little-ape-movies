import { View, Text } from "react-native";
import React from "react";
import SavedFilterContainer from "@/components/settings/savedfilters/SavedFilterContainer";
import { Stack } from "expo-router";
import HomeButton from "@/components/drawer/HomeButton";

const SavedFiltersRoute = () => {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HomeButton /> }} />
      <SavedFilterContainer />
    </>
  );
};

export default SavedFiltersRoute;
