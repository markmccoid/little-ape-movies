import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import SavedFilterAddEdit from "./SavedFilterAddEdit";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import DragDropEntry from "@/components/common/DragAndSort/DragDropEntry";
import { DeleteIcon, EditIcon, EmptyMDHeartIcon, MDHeartIcon } from "@/components/common/Icons";
import { Positions, sortArray } from "@/components/common/DragAndSort/helperFunctions";
import { useCustomTheme } from "@/lib/colorThemes";
import SortEditor from "../quickSorts/SortEditor";
import SelectDefaultFilter from "../SelectDefaultFilter";

const ROW_HEIGHT = 40;

const SavedFilterContainer = () => {
  const savedFilters = useSettingsStore((state) => state.savedFilters);
  const filterActions = useSettingsActions();
  const { colors } = useCustomTheme();
  const [showAddEdit, toggleShowAddEdit] = React.useReducer((state) => !state, false);
  const [filterId, setFilterId] = React.useState<string | undefined>(undefined);
  const navigation = useNavigation();

  //Save Filter
  const cancelAddEditMode = () => {
    setFilterId(undefined);
    toggleShowAddEdit();
    navigation.setOptions({
      // Reset to defaults on unmount
      headerLeft: undefined,
      headerRight: undefined,
      title: "Saved Filters",
    });
  };
  const handleUpdatePositions = (positions: Positions) => {
    const finalQuickSorts = sortArray(positions, savedFilters, { positionField: "index" });
    filterActions.overwriteAllSavedFilters(finalQuickSorts);
  };
  return (
    <View className="flex-col">
      {!showAddEdit && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <View className="flex-row justify-end m-2">
            <Button onPress={toggleShowAddEdit}>
              <Text>Create</Text>
            </Button>
          </View>
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
            {savedFilters?.map((filter) => {
              return (
                <Animated.View
                  key={filter.id}
                  id={filter.id}
                  layout={LinearTransition}
                  // entering={FadeIn}
                  // exiting={FadeOut}
                  style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: "#aaa",
                    height: ROW_HEIGHT,
                  }}
                  className="flex-row w-full justify-between items-center bg-card pl-2"
                >
                  <Text className="text-card-foreground text-lg font-medium">{filter.name}</Text>
                  <View className="flex-row h-full items-center">
                    <Pressable
                      onPress={() => {
                        filterActions.addUpdateSavedFilter({
                          ...filter,
                          favorite: !filter?.favorite,
                        });
                      }}
                      className="px-2 h-full flex-row items-center"
                    >
                      {filter?.favorite ? (
                        <MDHeartIcon size={20} color={colors.deleteRed} />
                      ) : (
                        <EmptyMDHeartIcon size={20} color={colors.cardForeground} />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setFilterId(filter.id);
                        toggleShowAddEdit();
                      }}
                      className="px-2 h-full flex-row items-center"
                    >
                      <EditIcon size={20} color={colors.cardForeground} />
                    </Pressable>
                    <Pressable
                      onPress={() => filterActions.deleteSavedFilter(filter.id)}
                      className="pl-2 pr-4  h-full flex-row items-center"
                    >
                      <DeleteIcon size={20} />
                    </Pressable>
                  </View>
                </Animated.View>
              );
            })}
          </DragDropEntry>
        </Animated.View>
      )}
      {showAddEdit && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <SavedFilterAddEdit filterId={filterId} cancelAddEdit={cancelAddEditMode} />
        </Animated.View>
      )}
      <View className="border-t-hairline border-border mt-4 mx-2" />
      <SelectDefaultFilter />
    </View>
  );
};

export default SavedFilterContainer;
