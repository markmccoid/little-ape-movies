import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import MovieItem from "./MovieItem";
import dayjs from "dayjs";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  movie: ShowItemType;
};
const MoviesContainer = () => {
  const movies = useMovieStore((state) => state.shows);
  const { currentUser } = useAuth();
  const removeMovie = useMovieStore((state) => state.actions.removeShow);
  return (
    <FlatList
      data={movies}
      renderItem={({ item }) => <MovieItem movie={item} />}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
};

export default MoviesContainer;
