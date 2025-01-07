import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { DeleteIcon, EditIcon } from "@/components/common/Icons";
import { sortBy } from "lodash";
import DragDropEntry from "@/components/common/DragAndSort/DragDropEntry";
import { Positions, sortArray } from "@/components/common/DragAndSort/helperFunctions";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";

const ROW_HEIGHT = 40;
const CurrentQuickSorts = ({ setEditId }: { setEditId: (editId: string | undefined) => void }) => {
  const quickSorts = useSettingsStore((state) => state.savedQuickSorts);
  const actions = useSettingsActions();
  const sortedQS = sortBy(quickSorts, "index");

  const handleUpdatePositions = (positions: Positions) => {
    const finalQuickSorts = sortArray(positions, sortedQS, { positionField: "index" });
    actions.overwriteAllQuickSorts(finalQuickSorts);
  };
  return (
    <View className="mx-2 mt-2">
      <DragDropEntry
        scrollStyles={{
          width: "100%",
          maxHeight: ROW_HEIGHT * 4 + 20,
          borderWidth: 1,
          borderColor: "#aaa",
        }}
        updatePositions={(positions) => handleUpdatePositions(positions)}
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={ROW_HEIGHT}
        handlePosition="left"
        //handle={MyHandle} // This is optional.  leave out if you want the default handle
        enableDragIndicator={true}
      >
        {sortedQS?.map((sort) => {
          return (
            <Animated.View
              key={sort.id}
              id={sort.id}
              layout={LinearTransition}
              entering={FadeIn}
              exiting={FadeOut}
              className="flex-row w-full items-center bg-card pl-2 justify-between"
              style={{
                height: ROW_HEIGHT,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: "#aaa",
              }}
            >
              <Text className="text-card-foreground text-lg flex-1 font-medium" numberOfLines={1}>
                {sort.name}
              </Text>

              <View className="flex-row h-full items-center w-[75]">
                <Pressable
                  onPress={() => setEditId(sort.id)}
                  className="px-2 h-full flex-row items-center"
                >
                  <EditIcon size={20} />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    const onDelete = await showConfirmationPrompt("Delete Quick Sort?", " ");
                    if (!onDelete) {
                      return;
                    }
                    actions.deleteQuickSort(sort.id);
                  }}
                  className="pl-2 pr-4  h-full flex-row items-center"
                >
                  <DeleteIcon size={20} />
                </Pressable>
              </View>
            </Animated.View>
          );
        })}
      </DragDropEntry>
    </View>
  );
};

export default CurrentQuickSorts;
