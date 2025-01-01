import { View, TextInput, Alert, Pressable, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import SavedFilterTags from "./SavedFilterTags";
import SavedFilterGenres from "./SavedFilterGenres";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSettingsStore, { SortField, useSettingsActions } from "@/store/store.settings";
import uuid from "react-native-uuid";
import useMovieStore, { Tag } from "@/store/store.shows";
import { GenreState } from "./SavedFilterGenres";
import { TagState } from "./SavedFilterTags";

import { Stack } from "expo-router";
import SortEditor from "../quickSorts/SortEditor";
import { ChevronLeft } from "@/lib/icons/ChevronLeft";
import { SaveIcon } from "@/components/common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { SymbolView } from "expo-symbols";
import { MotiView } from "moti";
import SavedFilterWatchFavs from "./SavedFilterWatchFavs";

// Build the initial state of the tags
const createTagState = (
  includeTags: string[],
  excludeTags: string[],
  allTags: Tag[]
): TagState[] => {
  const tags = [
    ...includeTags.map((tag) => ({ id: tag, state: "include" })),
    ...excludeTags.map((tag) => ({ id: tag, state: "exclude" })),
  ];
  return tags.map((tag) => ({
    id: tag.id,
    name: allTags.find((t) => t.id === tag.id)?.name || "",
    state: tag.state as TagState["state"],
  }));
};

const createGenreState = (
  includeGenres: string[],
  excludeGenres: string[],
  allGenres: string[]
) => {
  const genres = [
    ...includeGenres.map((genre) => ({ genre, state: "include" })),
    ...excludeGenres.map((genre) => ({ genre, state: "exclude" })),
  ];
  return genres.map((genre) => ({
    genre: genre.genre,
    state: genre.state as GenreState["state"],
  }));
};

type Props = {
  filterId: string | undefined;
  cancelAddEdit: () => void;
};
const SavedFilterAddEdit = ({ filterId, cancelAddEdit }: Props) => {
  const addUpdateSavedFilter = useSettingsActions().addUpdateSavedFilter;
  const savedFilters = useSettingsStore((state) => state.savedFilters);
  const allTags = useMovieStore((state) => state.tagArray);
  const allGenres = useMovieStore((state) => state.genreArray);
  const [initTags, setInitTags] = React.useState<TagState[]>([]);
  const [initGenres, setInitGenres] = React.useState<GenreState[]>([]);
  const [initSort, setInitSort] = React.useState<SortField[]>(
    savedFilters.find((el) => el.id === filterId)?.sort || []
  );
  const inputRef = React.useRef<TextInput>(null);
  const { colors } = useCustomTheme();
  const [tagExcludeList, setTagExcludeList] = React.useState<string[]>([]);
  const [tagIncludeList, setTagIncludeList] = React.useState<string[]>([]);
  const [genreExcludeList, setGenreExcludeList] = React.useState<string[]>([]);
  const [genreIncludeList, setGenreIncludeList] = React.useState<string[]>([]);
  const [filterName, setFilterName] = React.useState<string>("");
  const [newSort, setNewSort] = React.useState<SortField[]>([]);
  const [newWatchedState, setNewWatchedState] = React.useState<"off" | "include" | "exclude">(
    "off"
  );
  const [newFavoritedState, setNewFavoritedState] = React.useState<"off" | "include" | "exclude">(
    "off"
  );

  useEffect(() => {
    // If filterId exists, then we are editing
    if (filterId) {
      const filter = savedFilters.find((filter) => filter.id === filterId);

      if (filter) {
        setInitTags(
          createTagState(filter.filter.includeTags || [], filter.filter.excludeTags || [], allTags)
        );
        setInitGenres(
          createGenreState(
            filter.filter.includeGenres || [],
            filter.filter.excludeGenres || [],
            allGenres
          )
        );
        setInitSort(filter.sort);
        setFilterName(filter.name);
        setTagExcludeList(filter.filter.excludeTags || []);
        setTagIncludeList(filter.filter.includeTags || []);
        setGenreExcludeList(filter.filter.excludeGenres || []);
        setGenreIncludeList(filter.filter.includeGenres || []);
        setNewWatchedState(filter.filter?.filterIsWatched || "off");
        setNewFavoritedState(filter.filter?.filterIsFavorited || "off");
      }
    }
  }, [filterId]);

  const handleTagList = (tagIdIn: string, action: "include" | "exclude" | "off") => {
    if (action === "exclude") {
      setTagExcludeList((prev) => [...new Set([...prev, tagIdIn])]);
      setTagIncludeList((prev) => prev.filter((id) => id !== tagIdIn));
      return;
    }
    if (action === "include") {
      setTagIncludeList((prev) => [...new Set([...prev, tagIdIn])]);
      setTagExcludeList((prev) => prev.filter((id) => id !== tagIdIn));
      return;
    }
    if (action === "off") {
      setTagIncludeList((prev) => prev.filter((id) => id !== tagIdIn));
      setTagExcludeList((prev) => prev.filter((id) => id !== tagIdIn));
      return;
    }
  };
  const handleGenreList = (genreIn: string, action: "include" | "exclude" | "off") => {
    if (action === "exclude") {
      setGenreExcludeList((prev) => [...new Set([...prev, genreIn])]);
      setGenreIncludeList((prev) => prev.filter((id) => id !== genreIn));
      return;
    }
    if (action === "include") {
      setGenreIncludeList((prev) => [...new Set([...prev, genreIn])]);
      setGenreExcludeList((prev) => prev.filter((id) => id !== genreIn));
      return;
    }
    if (action === "off") {
      setGenreIncludeList((prev) => prev.filter((id) => id !== genreIn));
      setGenreExcludeList((prev) => prev.filter((id) => id !== genreIn));
      return;
    }
  };
  const handleNewSort = (sort: SortField[]) => {
    setNewSort(sort);
  };

  const handleWatched = (state: "off" | "include" | "exclude") => {
    setNewWatchedState(state);
  };
  const handleFavorites = (state: "off" | "include" | "exclude") => {
    setNewFavoritedState(state);
  };
  //Save Filter
  const saveFilter = () => {
    if (!filterName || filterName === "") {
      Alert.alert("Filter Name is required");
      inputRef.current?.focus();
      return;
    }

    addUpdateSavedFilter({
      id: filterId || uuid.v4(),
      name: filterName,
      favorite: savedFilters.find((filter) => filter.id === filterId)?.favorite || false,
      filter: {
        excludeGenres: genreExcludeList,
        includeGenres: genreIncludeList,
        excludeTags: tagExcludeList,
        includeTags: tagIncludeList,
        filterIsFavorited: newFavoritedState,
        filterIsWatched: newWatchedState,
      },
      sort: newSort,
    });
    // Close screen
    cancelAddEdit();
  };

  return (
    <ScrollView className="flex flex-col mt-2 mb-10" contentContainerClassName="pb-14">
      <Stack.Screen
        options={{
          title: "Add/Edit Filter",
          headerLeft: () => (
            <Pressable onPress={cancelAddEdit} className="flex-row  items-center ml-[-16]">
              <ChevronLeft size={30} />
              <Text className="text-lg font-semibold text-primary">Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={saveFilter}
              className="flex-row  items-center ml-[-16] border-border border rounded-md bg-primary py-1 px-2"
            >
              <Text className="text-lg font-semibold mr-1 text-primary-foreground">Save</Text>
              <SaveIcon size={20} color={colors.primaryForeground} />
            </Pressable>
          ),
        }}
      />
      <View className="px-3 mb-4">
        <Text className="px-1 font-semibold text-xl">Filter Name</Text>

        <View className="">
          <TextInput
            ref={inputRef}
            placeholder="Filter Name"
            className="px-2 py-2 bg-card text-card-foreground rounded-lg border-hairline border-border"
            value={filterName}
            onChangeText={(text) => setFilterName(text)}
            style={{ fontSize: 18 }}
          />
          {filterName !== "" && (
            <Pressable
              className="absolute right-2 top-0 bottom-0 justify-center"
              onPress={() => setFilterName("")}
            >
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: filterName ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "timing", duration: 500 }}
              >
                <SymbolView
                  name="x.circle.fill"
                  type="palette"
                  colors={["white", "gray"]}
                  size={17}
                />
              </MotiView>
            </Pressable>
          )}
        </View>
      </View>
      {/* <View className="flex-row justify-between mx-4 mt-2">
        <Button onPress={cancelAddEdit}>
          <Text>Cancel</Text>
        </Button>
        <Button onPress={saveFilter}>
          <Text>Save</Text>
        </Button>
      </View> */}
      <View className="bg-primary mx-2 my-2" style={{ height: StyleSheet.hairlineWidth }} />
      {/* <Text className="px-4 font-semibold text-xl mt-2"></Text> */}
      <SavedFilterWatchFavs
        filterInfo={{ watched: newWatchedState, favorites: newFavoritedState }}
        handleWatched={handleWatched}
        handleFavorites={handleFavorites}
      />
      <View className="bg-primary mx-2 mt-2" style={{ height: StyleSheet.hairlineWidth }} />
      <Text className="px-4 font-semibold text-xl mt-2">Tags</Text>
      <SavedFilterTags handleTagList={handleTagList} initTags={initTags} />
      <View className="bg-primary mx-2 mt-2" style={{ height: StyleSheet.hairlineWidth }} />
      <Text className="px-4 font-semibold text-xl mt-2">Genres</Text>
      <SavedFilterGenres handleGenreList={handleGenreList} initGenres={initGenres} />
      <View className="bg-primary mx-2 mt-2" style={{ height: StyleSheet.hairlineWidth }} />
      <Text className="px-4 font-semibold text-xl mt-2">Sort</Text>
      <SortEditor initSort={initSort} handleNewSort={handleNewSort} />
    </ScrollView>
  );
};

export default SavedFilterAddEdit;
