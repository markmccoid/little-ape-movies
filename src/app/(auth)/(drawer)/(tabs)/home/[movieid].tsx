import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Link, Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import MovieDetails from "@/components/movies/MovieDetails";

const MovieDetailHome = () => {
  const { movieid } = useGlobalSearchParams();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `Movie - ${movieid}` });
  }, []);
  console.log("MOVIE ID HOME/", movieid);

  return <MovieDetails movieId={movieid} />;
};

export default MovieDetailHome;
