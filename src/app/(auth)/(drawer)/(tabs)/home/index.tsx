import { View, Text, Pressable, useColorScheme, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useFocusEffect, useSegments } from "expo-router";
import { FilterIcon } from "@/components/common/Icons";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import MoviesContainer from "@/components/movies/MoviesContainer";
import { getCurrentUser } from "@/store/dataAccess/localStorage-users";
import { useCustomTheme } from "@/lib/colorThemes";
import { useSearchStore } from "@/store/store.search";
import useMovieStore from "@/store/store.shows";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";

const HomeIndex = () => {
  const { colors } = useCustomTheme();
  const currUser = getCurrentUser();
  const { includeTags, excludeTags, includeGenres } = useSettingsStore(
    (state) => state.filterCriteria
  );
  const { clearFilters } = useSettingsActions();

  const filterCount = {
    includeTagsCount: includeTags?.length || 0,
    excludeTagsCount: excludeTags?.length || 0,
    includeGenresCount: includeGenres?.length || 0,
  };

  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Movies-${currUser}`,
          headerLeft: () => <NestedStackDrawerToggle />,
          headerRight: () => (
            <View>
              {!!filterCount.includeTagsCount && (
                <View className="absolute w-[14] h-[14] rounded-full bg-green-700 top-0 left-[5] z-10 flex-row justify-center items-center">
                  <Text className="absolute text-white text-xs font-semibold">
                    {filterCount.includeTagsCount}
                  </Text>
                </View>
              )}
              {!!filterCount.excludeTagsCount && (
                <View className="absolute w-[14] h-[14] rounded-full bg-red-600 top-0 right-[-5] z-10 flex-row justify-center items-center">
                  <Text className="absolute text-white text-xs font-semibold">
                    {filterCount.excludeTagsCount}
                  </Text>
                </View>
              )}
              {!!filterCount.includeGenresCount && (
                <View className="absolute w-[14] h-[14] rounded-full bg-yellow-600 bottom-0 right-[6] z-10 flex-row justify-center items-center">
                  <Text className="absolute text-white text-xs font-semibold">
                    {filterCount.includeGenresCount}
                  </Text>
                </View>
              )}
              <Link href="./home/filtermodal" className="py-1 px-2 mr-[-7]" asChild>
                <Pressable onLongPress={() => clearFilters("all")}>
                  <FilterIcon color={colors.primary} />
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />

      <MoviesContainer />
    </View>
  );
};

export default HomeIndex;
