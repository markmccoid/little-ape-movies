import { View, Text, Pressable } from "react-native";
import React, { useReducer, useState } from "react";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import QuickSortAddNew from "./QuickSortAddNew";
import { Button } from "../../ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import CurrentQuickSorts from "./CurrentQuickSorts";
import { quickSorts as defaultQuickSorts } from "@/store/sortSettings";

const QuickSortContainer = () => {
  const quickSorts = useSettingsStore((state) => state.savedQuickSorts);
  const [showAddNew, toggleShowAddNew] = useReducer((state) => !state, false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const actions = useSettingsActions();

  const handleSetEditId = (QSId: string | undefined) => setEditId(QSId);
  const handleRestoreDefaults = () => {
    defaultQuickSorts.map((sort) => {
      actions.addUpdateQuickSort(sort);
    });
  };
  const handleHide = () => {
    if (editId) {
      setEditId(undefined);
    } else {
      toggleShowAddNew();
    }
  };
  return (
    <View className="flex-1 flex-col">
      <View className="flex-row justify-end">
        <Pressable
          className="py-1 px-2 border-hairline bg-secondary"
          onPress={handleRestoreDefaults}
        >
          <Text className="text-secondary-foreground">Restore Defaults</Text>
        </Pressable>
      </View>
      <CurrentQuickSorts setEditId={handleSetEditId} />

      {!showAddNew && !editId && (
        <Animated.View
          className="flex-row justify-end mt-1 mr-4"
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Button onPress={toggleShowAddNew} className="bg-primary">
            <Text className="text-primary-foreground">Add New</Text>
          </Button>
        </Animated.View>
      )}
      {(showAddNew || editId) && <QuickSortAddNew handleHide={handleHide} editId={editId} />}
    </View>
  );
};

export default QuickSortContainer;
