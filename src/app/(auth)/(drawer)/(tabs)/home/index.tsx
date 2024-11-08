import { View, Text, Pressable, useColorScheme, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useFocusEffect } from "expo-router";
import { FilterIcon } from "@/components/common/Icons";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import MoviesContainer from "@/components/movies/MoviesContainer";
import { getCurrentUser } from "@/store/dataAccess/localStorage-users";
import { useCustomTheme } from "@/lib/colorThemes";
import { useSearchStore } from "@/store/store.search";

const Page = () => {
  const { colors } = useCustomTheme();
  const currUser = getCurrentUser();
  const setDetailTarget = useSearchStore((state) => state.actions.setTarget);

  useFocusEffect(
    useCallback(() => {
      setDetailTarget(["home"]);
    }, [])
  );
  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Movies-${currUser}`,
          headerLeft: () => <NestedStackDrawerToggle />,
          headerRight: () => (
            <Link href="./home/filtermodal">
              <FilterIcon color={colors.primary} />
            </Link>
          ),
        }}
      />

      <MoviesContainer />
    </View>
  );
};

export default Page;
