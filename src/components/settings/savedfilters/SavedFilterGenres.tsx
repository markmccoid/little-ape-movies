import { View, Text } from "react-native";
import React from "react";
import useMovieStore, { Tag } from "@/store/store.shows";

import GenreCloudEnhanced, { GenreItem } from "@/components/common/TagCloud/GenreCloudEnhanced";
import { useSettingsActions } from "@/store/store.settings";
export type GenreState = {
  genre: string;
  state: "off" | "include" | "exclude";
};

const cycleState = (state: GenreState["state"]) => {
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

const buildGenreState = (genres: string[], initGenres: GenreState[]): GenreState[] => {
  return genres.map((genre) => ({
    genre,
    state: initGenres.find((g) => g.genre === genre)?.state || "off",
  }));
};
type Props = {
  handleGenreList: (genreIn: string, action: "include" | "exclude" | "off") => void;
  initGenres: GenreState[];
};
const SavedFilterGenres = ({ handleGenreList, initGenres }: Props) => {
  const allGenres = useMovieStore((state) => state.genreArray);
  const [genreState, setGenreState] = React.useState<GenreState[]>(
    buildGenreState(allGenres, initGenres)
  );

  // Update the tagState when the initTags change
  React.useEffect(() => {
    setGenreState(buildGenreState(allGenres, initGenres));
  }, [initGenres]);

  const handleGenreSelect = (genreState: GenreState["state"]) => async (genreIn: string) => {
    // include -> exclude -> off
    if (genreState === "include") {
      setGenreState((prev) =>
        prev.map((genre) => (genre.genre === genreIn ? { ...genre, state: "exclude" } : genre))
      );
      handleGenreList(genreIn, "exclude");
      // // Add to Exclude tag list and remove from Include tag list
      // setGenreExcludeList((prev) => [...new Set([...prev, genreIn])]);
      // setGenreIncludeList((prev) => prev.filter((id) => id !== genreIn));
      return;
    }

    if (genreState === "exclude") {
      setGenreState((prev) =>
        prev.map((genre) => (genre.genre === genreIn ? { ...genre, state: "off" } : genre))
      );
      handleGenreList(genreIn, "off");
      // Add to Exclude tag list and remove from Include tag list
      return;
    }

    if (genreState === "off") {
      setGenreState((prev) =>
        prev.map((genre) => (genre.genre === genreIn ? { ...genre, state: "include" } : genre))
      );
      handleGenreList(genreIn, "include");
      return;
    }
  };

  const handleLongPress = (genreState: GenreState["state"]) => (genreIn: string) => {
    // off -> exclude
    if (genreState === "off") {
      setGenreState((prev) =>
        prev.map((genre) => (genre.genre === genreIn ? { ...genre, state: "exclude" } : genre))
      );
      handleGenreList(genreIn, "exclude");
      return;
    }
    // exclude -> off, include -> off
    setGenreState((prev) =>
      prev.map((genre) => (genre.genre === genreIn ? { ...genre, state: "off" } : genre))
    );
    handleGenreList(genreIn, "off");
  };

  return (
    <View>
      <GenreCloudEnhanced>
        {genreState.map((genre) => (
          <GenreItem
            key={genre.genre}
            tagId={genre.genre}
            tagName={genre.genre}
            size="s"
            state={genre.state}
            onToggleTag={handleGenreSelect(genre.state)}
            onLongPress={handleLongPress(genre.state)}
          />
        ))}
      </GenreCloudEnhanced>
    </View>
  );
};

export default SavedFilterGenres;
