import { View, Pressable, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, type NativeStackNavigationOptions } from "expo-router";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import { Text } from "@/components/ui/text";
import FilterTags from "./FilterTags";
import FilterGenres from "./FilterGenres";
import InclusionPicker, {
  favoriteInclusionOptions,
  watchedInclusionOptions,
} from "@/components/common/InclusionPicker";
import { Eraser } from "@/lib/icons/Eraser";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
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
      <View className="mx-2">
        <InclusionPicker
          label="Watched"
          options={watchedInclusionOptions}
          value={filterCriteria?.filterIsWatched}
          onChange={filterActions.setIsWatchedState}
        />
      </View>
      <View className="h-2" />
      <View className="mx-2">
        <InclusionPicker
          label="Favorites"
          options={favoriteInclusionOptions}
          value={filterCriteria?.filterIsFavorited}
          onChange={filterActions.setIsFavoritedState}
        />
      </View>
      {/* Tag Selection */}
      <View className="mx-1 mt-4 bg-primary rounded-lg flex-row items-center justify-between">
        <Text className="px-2 py-1 text-xl font-semibold text-primary-foreground">
          Filter By Tags
        </Text>
        {tagsActive && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <Pressable onPress={() => filterActions.clearFilters("Tags")} className="px-2 py-1">
              <Eraser className="text-primary-foreground" size={20} />
            </Pressable>
          </Animated.View>
        )}
      </View>
      <FilterTags />
      {/* Genre Selection */}
      <View className="mx-1 mt-4 bg-primary rounded-lg flex-row items-center justify-between">
        <Text className="px-2 py-1 text-xl font-semibold text-primary-foreground">
          Filter By Genres
        </Text>
        {genresActive && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <Pressable onPress={() => filterActions.clearFilters("Genres")} className="px-2 py-1">
              <Eraser className="text-primary-foreground" size={20} />
            </Pressable>
          </Animated.View>
        )}
      </View>
      <FilterGenres />
      <SortEditor initSort={sort} handleNewSort={filterActions.updateSortSettings} />
    </ScrollView>
  );
};

export default FilterContainer;
