import { View, StyleSheet, Pressable } from "react-native";
import React, { useLayoutEffect } from "react";
import FilterContainer from "@/components/movies/filter/FilterContainer";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/lib/colorThemes";
import { useNavigation } from "expo-router";
import { CircleX } from "@/lib/icons/CircleX";
import { Text } from "@/components/ui/text";

const FilterModal = () => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  return (
    <View className="border-t border-border rounded-lg s">
      <View className="flex-row justify-center items-center p-2 bg-white">
        <LinearGradient
          colors={[colors.card, colors.background]}
          style={{ ...StyleSheet.absoluteFillObject }}
          start={{ x: 0, y: 0 }} // Start at the top-left corner
          end={{ x: 0, y: 1 }} // End at the bottom-right corner
        />
        <Text className="text-3xl font-semibold">Filter Movies</Text>
        <Pressable onPress={navigation.goBack} className="absolute right-0 px-4 py-4">
          <CircleX color={colors.cardForeground} />
        </Pressable>
      </View>
      <FilterContainer />
    </View>
  );
};

export default FilterModal;
