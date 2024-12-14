import { View, Text } from "react-native";
import React from "react";
import useSettingsStore from "@/store/store.settings";

const QuickSortContainer = () => {
  const quickSorts = useSettingsStore((state) => state.savedQuickSorts);
  return (
    <View>
      {quickSorts?.map((sort) => {
        return <Text key={sort.id}>{quickSorts.name}</Text>;
      })}
    </View>
  );
};

export default QuickSortContainer;
