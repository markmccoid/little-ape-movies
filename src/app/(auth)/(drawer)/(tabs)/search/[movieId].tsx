import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Link, Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import MovieDetails from "@/components/movieDetails/MovieDetails";

const MovieDetailSearch = () => {
  const { movieId } = useGlobalSearchParams<{ movieId: string }>();
  const newMovie = Math.floor(Math.random() * 10);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `Movie - ${movieId}` });
  }, []);

  return <MovieDetails movieId={movieId} newMovie={newMovie} />;
};

export default MovieDetailSearch;
