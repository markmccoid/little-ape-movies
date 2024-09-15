import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import useMovieStore from "@/store/store.movie";
import { Link } from "expo-router";

const MovieContainer = ({ movie }) => {
  const removeMovie = useMovieStore((state) => state.actions.removeMovie);
  return (
    <View className="border border-border rounded-lg mx-2 my-1 bg-secondary flex-row">
      <Link href={`./home/${movie.id}`}>
        <Image
          source={{ uri: movie.posterURL }}
          style={{ width: 140, height: 200, resizeMode: "contain" }}
          className="rounded-lg m-1 border border-border"
        />
      </Link>
      <TouchableOpacity className="flex-col ml-3 flex-1" onPress={() => removeMovie(movie.id)}>
        <Text className="text-text text-lg font-semibold text-center" numberOfLines={2}>
          {movie.id}
          {movie.title}
        </Text>
        <Image source={{ uri: movie.posterURL }} style={{ width: 100, height: 150 }} />
        {/* <Text className="text-text text-center">Date Added: {movie.dateAdded}</Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default MovieContainer;
