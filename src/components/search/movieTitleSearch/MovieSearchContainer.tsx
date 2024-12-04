import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useTitleSearch } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import useMovieStore from "@/store/store.shows";
import SearchContainer from "../SearchContainer";

const MovieSearchContainer = () => {
  const { movies, isLoading, fetchNextPage } = useTitleSearch();

  return <SearchContainer movies={movies} fetchNextPage={fetchNextPage} />;
};

export default MovieSearchContainer;
