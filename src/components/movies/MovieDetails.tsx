import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import MovieImage from "../common/MovieImage";
import { useMovieData } from "@/store/dataHooks";
import useMovieStore from "@/store/store.movie";

const MovieDetails = ({ movieId }: { movieId: number }) => {
  const navigation = useNavigation();
  const { data: movie, isLoading } = useMovieData(movieId);
  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  return (
    <View className="flex-1">
      <Text className="text-text">MovieId {movie.id}</Text>
      <Text className="text-text text-lg font-semibold">{movie.title}</Text>
      <MovieImage posterURL={movie.posterURL} imageWidth={150} title={movie.title} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>GO BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
