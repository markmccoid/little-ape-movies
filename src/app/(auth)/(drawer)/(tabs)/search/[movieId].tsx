import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Link, Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailSearch = () => {
  const { movieId } = useGlobalSearchParams<{ movieId: string }>();
  const newMovie = Math.floor(Math.random() * 10);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `Movie - ${movieId}` });
  }, []);

  return <MovieDetailsContainer movieId={parseInt(movieId, 10)} />;
};

export default MovieDetailSearch;
