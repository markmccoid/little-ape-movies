import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import GenreCloudEnhanced, { GenreItem } from "@/components/common/TagCloud/GenreCloudEnhanced";
import useFilterGenres from "./useFilterGenres";
import { useSettingsActions } from "@/store/store.settings";

const FilterGenres = () => {
  // const genres = useMovieStore((state) => state.genreArray);
  const genres = useFilterGenres();
  const actions = useSettingsActions();
  // Extract the type of the `state` property within each item of `mergedTags`
  type MergedTagState = (typeof genres)[number]["state"];
  const handleGenreSelect = (genreState: MergedTagState) => (genre: string) => {
    // include -> exclude -> off
    if (genreState === "include") {
      actions.updateGenresFilter("exclude", genre, "add");
      return;
    }
    if (genreState === "exclude") {
      actions.updateGenresFilter("exclude", genre, "remove");
      return;
    }
    if (genreState === "off") {
      actions.updateGenresFilter("include", genre, "add");
      return;
    }
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
        {genres.map((genre) => (
          <GenreItem
            tagId={genre.genre}
            tagName={genre.genre}
            state={genre.state}
            size="s"
            onToggleTag={handleGenreSelect(genre.state)}
            onLongPress={handleLongPress(genre.state)}
            key={genre.genre}
          />
        ))}
      </GenreCloudEnhanced>
    </View>
  );
};

export default FilterGenres;
