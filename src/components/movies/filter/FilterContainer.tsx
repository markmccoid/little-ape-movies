import { View, Pressable, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import useSettingsStore, { getInclusionIndex, useSettingsActions } from "@/store/store.settings";
import { Text } from "@/components/ui/text";
import FilterTags from "./FilterTags";
import FilterGenres from "./FilterGenres";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Eraser } from "@/lib/icons/Eraser";
import { AnimatePresence, MotiView } from "moti";
import SortEditor from "@/components/settings/quickSorts/SortEditor";
import { useShallow } from "zustand/react/shallow";

const FilterContainer = () => {
  const navigation = useNavigation();
  const filterCriteria = useSettingsStore((state) => state.filterCriteria);
  const filterActions = useSettingsActions();
  // Need useShallow because of infinite loop caused in sortEditor
  const sort = useSettingsStore(useShallow((state) => state.sortSettings));
  const tagsActive =
    (filterCriteria?.includeTags || []).length > 0 ||
    (filterCriteria?.excludeTags || []).length > 0;
  const genresActive =
    (filterCriteria?.includeGenres || []).length > 0 ||
    (filterCriteria?.excludeGenres || []).length > 0;

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: "Set Filters",
      // headerRight:
      // headerLeft: () => (
      //   <Pressable onPress={() => router.back()} className="ml-[-8]">
      //     <View className="flex-row items-center">
      //       <SymbolView name="chevron.backward" />
      //       <Text className="text-lg ">Back</Text>
      //     </View>
      //   </Pressable>
      // ),
    };
    navigation.setOptions(options);
  });
  return (
    <ScrollView className="pt-3 mb-[80]" contentContainerClassName="pb-[50]">
      {/* //! Need to create a three way selector for both of these AND 
      //! update the filter code to obey the new selectors */}
      <SegmentedControl
        className="w-[100]"
        values={["Ignore", "Watched", "Unwatched"]}
        selectedIndex={getInclusionIndex(filterCriteria?.filterIsWatched)}
        onChange={(event) => {
          console.log("W Changed", event.nativeEvent.selectedSegmentIndex);
          const state = event.nativeEvent.selectedSegmentIndex;
          filterActions.setIsWatchedState(state as 0 | 1 | 2);
        }}
      />
      <View className="h-2" />
      <SegmentedControl
        className="w-[100]"
        values={["Ignore", "Favorites", "Exclude Favs"]}
        selectedIndex={getInclusionIndex(filterCriteria?.filterIsFavorited)}
        onChange={(event) => {
          const state = event.nativeEvent.selectedSegmentIndex;
          filterActions.setIsFavoritedState(state as 0 | 1 | 2);
        }}
      />
      {/* Tag Selection */}
      <View className="mx-1 mt-4 bg-primary rounded-lg flex-row items-center justify-between">
        <Text className="px-2 py-1 text-xl font-semibold text-primary-foreground">
          Filter By Tags
        </Text>
        <AnimatePresence>
          {tagsActive && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Pressable onPress={() => filterActions.clearFilters("Tags")} className="px-2 py-1">
                <Eraser className="text-primary-foreground" size={20} />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
      <FilterTags />
      {/* Genre Selection */}
      <View className="mx-1 mt-4 bg-primary rounded-lg flex-row items-center justify-between">
        <Text className="px-2 py-1 text-xl font-semibold text-primary-foreground">
          Filter By Genres
        </Text>
        <AnimatePresence>
          {genresActive && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Pressable onPress={() => filterActions.clearFilters("Genres")} className="px-2 py-1">
                <Eraser className="text-primary-foreground" size={20} />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
      <FilterGenres />
      <SortEditor initSort={sort} handleNewSort={filterActions.updateSortSettings} />
    </ScrollView>
  );
};

export default FilterContainer;
