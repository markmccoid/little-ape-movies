import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import GenreCloudEnhanced, { GenreItem } from "@/components/common/TagCloud/GenreCloudEnhanced";
import useFilterGenres from "./useFilterGenres";
import { useSettingsActions } from "@/store/store.settings";
type State = ReturnType<typeof useFilterGenres>[number];

const cycleState = (state: State["state"]) => {
  switch (state) {
    case "include":
      return "exclude";
    case "exclude":
      return "off";
    case "off":
      return "include";
    default:
      return "off";
  }
};

const FilterGenres = () => {
  // const genres = useMovieStore((state) => state.genreArray);
  const genres = useFilterGenres();
  const actions = useSettingsActions();

  // Extract the type of the `state` property within each item of `mergedTags`
  type MergedTagState = (typeof genres)[number]["state"];
  const handleGenreSelect = (genreState: MergedTagState) => async (genre: string) => {
    // include -> exclude -> off
    const newState = cycleState(genreState);

    // await new Promise((resolve) => setTimeout(() => resolve("dont"), 1000));
    if (newState === "off") {
      actions.updateGenresFilter("exclude", genre, "remove");
      actions.updateGenresFilter("include", genre, "remove");
      return;
    }
    actions.updateGenresFilter(newState, genre, "add");
  };
  const handleLongPress = (genreState: MergedTagState) => (genre: string) => {
    // off -> exclude
    if (genreState === "off") {
      actions.updateGenresFilter("exclude", genre, "add");
      return;
    }
    // exclude -> off, include -> off
    actions.updateGenresFilter("exclude", genre, "remove");
    actions.updateGenresFilter("include", genre, "remove");
  };
  return (
    <View>
      <GenreCloudEnhanced>
        {genres.map((genre) => {
          return (
            <GenreItem
              tagId={genre.genre}
              tagName={genre.genre}
              state={genre.state}
              size="s"
              onToggleTag={handleGenreSelect(genre.state)}
              onLongPress={handleLongPress(genre.state)}
              key={genre.genre}
            />
          );
        })}
      </GenreCloudEnhanced>
    </View>
  );
};

export default FilterGenres;
