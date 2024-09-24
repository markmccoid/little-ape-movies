import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useTitleSearch } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import useMovieStore from "@/store/store.shows";
import SearchContainer from "../SearchContainer";

const MovieSearchContainer = () => {
  // const { isLoading } = useSearchResults();
  const { movies, isLoading, fetchNextPage } = useTitleSearch();
  const searchType = useSearchStore((state) => state.searchType);
  // const { setNextPage } = useSearchStore((state) => state.actions);
  const movieActions = useMovieStore((state) => state.actions);
  // console.log("MOVIES", movies.length);

  return <SearchContainer movies={movies} fetchNextPage={fetchNextPage} />;
};

export default MovieSearchContainer;
