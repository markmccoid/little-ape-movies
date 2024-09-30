import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailSearch = () => {
  const { showId } = useGlobalSearchParams<{ showId: string }>();

  // - Title is set in MovieDetailsContainer useFocusEffect()
  return <MovieDetailsContainer movieId={parseInt(showId, 10)} />;
};

export default MovieDetailSearch;
