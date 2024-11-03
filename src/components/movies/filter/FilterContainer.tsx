import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useLayoutEffect } from "react";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";

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
      <View className="flex-row">
        <Pressable
          onPress={() => filterActions.toggleIsWatched()}
          className="py-1 px-3 bg-primary rounded-full "
        >
          <Text className="text-text-inverted">
            {filterCriteria?.filterIsWatched ? "Watched" : "Not Watched"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => filterActions.toggleIsFavorited()}
          className="py-1 px-3 bg-primary rounded-full "
        >
          <Text className="text-text-inverted">
            {filterCriteria?.filterIsFavorited ? "Favorited" : "Not Favorited"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FilterContainer;
