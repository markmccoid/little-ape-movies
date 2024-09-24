import { View, Text, Pressable, useColorScheme, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import { FilterIcon } from "@/components/common/Icons";
import { useTheme } from "@react-navigation/native";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import MoviesContainer from "@/components/movies/MoviesContainer";
import { ScrollView } from "react-native-gesture-handler";

import useMovieStore from "@/store/store.shows";
import { getCurrentUser } from "@/store/dataAccess/localStorage-users";

const Page = () => {
  const { colors } = useTheme();
  // const [movies, setMovies] = useState([]);
  // const movies = useMovieData();
  const [state, setState] = useState(false);
  const movies = useMovieStore((state) => state.shows);

  const addMovie = useMovieStore((state) => state.actions.addShow);
  const currUser = getCurrentUser();

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
