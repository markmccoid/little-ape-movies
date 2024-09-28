import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailSearch = () => {
  const { movieId } = useGlobalSearchParams<{ movieId: string }>();

  // - Title is set in MovieDetailsContainer useFocusEffect()
  return <MovieDetailsContainer movieId={parseInt(movieId, 10)} />;
};

export default MovieDetailSearch;
