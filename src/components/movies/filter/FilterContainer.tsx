import { View, TouchableOpacity, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FilterTags from "./FilterTags";

const FilterContainer = () => {
  const navigation = useNavigation();
  const filterCriteria = useSettingsStore((state) => state.filterCriteria);
  const filterActions = useSettingsActions();

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: "Set Filters", //storedMovie?.title || movieDetails?.title || "",
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
    <View>
      <Text>FilterContainer</Text>
      <View className="flex-row mx-2">
        <View className="flex-row">
          <Checkbox
            aria-labelledby="watched"
            checked={!!filterCriteria?.filterIsWatched}
            onCheckedChange={(checked) => {
              filterActions.toggleIsWatched();
            }}
          />
          <Label nativeID="watched" onPress={() => filterActions.toggleIsWatched()}>
            Watched
          </Label>
        </View>

        <View className="flex-row">
          <Checkbox
            checked={!!filterCriteria?.filterIsFavorited}
            onCheckedChange={(checked) => {
              filterActions.toggleIsFavorited();
            }}
          />
          <Text className="ml-1">Favorited</Text>
        </View>
      </View>
      <FilterTags />
    </View>
  );
};

export default FilterContainer;
