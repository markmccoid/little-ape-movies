import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Link, Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailHome = () => {
  const { movieid } = useGlobalSearchParams();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `Movie - ${movieid}` });
  }, []);
  console.log("MOVIE ID HOME/", movieid);

  return <MovieDetailsContainer movieId={movieid} />;
};

export default MovieDetailHome;
