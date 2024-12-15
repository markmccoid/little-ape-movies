import { View, Text } from "react-native";
import React, { useReducer, useState } from "react";
import useSettingsStore from "@/store/store.settings";
import QuickSortAddNew from "./QuickSortAddNew";
import { Button } from "../ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const QuickSortContainer = () => {
  const quickSorts = useSettingsStore((state) => state.savedQuickSorts);
  const [showAddNew, toggleShowAddNew] = useReducer((state) => !state, false);

  console.log("QSorts", quickSorts, showAddNew);
  return (
    <View className="flex-1 flex-col">
      <View className="my-3 mx-2">
        {quickSorts?.map((sort) => {
          return <Text key={sort.id}>{sort.name}</Text>;
        })}
      </View>

      {!showAddNew && (
        <Animated.View className="flex-row justify-end mr-4" entering={FadeIn} exiting={FadeOut}>
          <Button onPress={toggleShowAddNew} className="bg-primary">
            <Text className="text-primary-foreground">Add New</Text>
          </Button>
        </Animated.View>
      )}
      <View>{showAddNew && <QuickSortAddNew handleHide={toggleShowAddNew} />}</View>
    </View>
  );
};

export default QuickSortContainer;
