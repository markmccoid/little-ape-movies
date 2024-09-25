import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React, { useLayoutEffect } from "react";
import { Link, useNavigation } from "expo-router";
import MovieImage from "@/components/common/MovieImage";
import { useMovieData } from "@/store/dataHooks";
import { useHeaderHeight } from "@react-navigation/elements";
import useMovieStore from "@/store/store.shows";

const { width, height } = Dimensions.get("window");

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const { data: movie, isLoading } = useMovieData(movieId);
  // const movieFound = useMovieStore((state) => state.shows.find((el) => el.id === movieId));
  useLayoutEffect(() => {
    navigation.setOptions({
      title: movie?.title || "",
    });
  }, [isLoading]);
  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  return (
    <View className="flex-1">
      <Image
        className="absolute"
        source={{ uri: movie.backdropURL }}
        style={{ width, height: width * 0.56, opacity: 0.5 }}
      />
      <View className="flex-1" style={{ marginTop: headerHeight }}>
        {/* <Text className="text-text text-lg font-semibold">{movie.title}</Text> */}
        <MovieImage posterURL={movie.posterURL} imageWidth={150} title={movie.title} />
        <Text className="text-text">MovieId {movie.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetailsContainer;
