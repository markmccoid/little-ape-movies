import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { Link, Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";
import { useMovieData } from "@/store/dataHooks";

const MovieDetailHome = () => {
  const { showId } = useGlobalSearchParams<{ showId: string }>();

  console.log("MOVIE ID HOME/", showId);

  // - Title is set in MovieDetailsContainer useFocusEffect()
  return <MovieDetailsContainer movieId={parseInt(showId, 10)} />;
};

export default MovieDetailHome;
