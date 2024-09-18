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

      {/* <Stack.Screen options={{ headerShown: true, headerLeft: () => <DrawerToggleButton /> }} /> */}
      <Text className="text-text text-base font-semibold">Page</Text>
      <View className="flex-row">
        <Link href="/(auth)/(tabs)/home/filtermodal" asChild>
          <Pressable className="border-hairline border-border rounded-lg bg-button py-1 px-2 m-1">
            <Text className="text-buttontext text-base font-semibold">Go to Stack2</Text>
          </Pressable>
        </Link>
        <View className="flex-col">
          <View className="flex-row">
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("1", "add");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("2", "add");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("5", "add");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 5</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("1", "remove");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("2", "remove");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 border-border border flex-row justify-center items-center rounded-lg"
              onPress={() => {
                updateTagFilter("5", "remove");
                // setState((prev) => !prev);
              }}
            >
              <Text className="text-text">Tag 5</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="m-2"></View>
      <TouchableOpacity onPress={() => addMovie({ id: "1", title: "The Village" })}>
        <Text className="text-text">ADD MOVIE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => addMovie({ id: "2", title: "Lady in the Water" })}>
        <Text className="text-text">ADD MOVIE 2</Text>
      </TouchableOpacity>
      <MoviesContainer />
    </View>
  );
};

export default Page;
