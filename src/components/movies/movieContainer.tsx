import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import useMovieStore from "@/store/movieStore";

const MovieContainer = ({ movie }) => {
  const removeMovie = useMovieStore((state) => state.removeMovie);
  return (
    <View className="border border-border rounded-lg mx-2 my-1 bg-secondary flex-row">
      <Image
        source={{ uri: movie.imageurl }}
        style={{ width: 140, height: 200, resizeMode: "contain" }}
        className="rounded-lg m-1 border border-border"
      />
      <TouchableOpacity className="flex-col ml-3 flex-1" onPress={() => removeMovie(movie.id)}>
        <Text className="text-text text-lg font-semibold text-center" numberOfLines={2}>
          {movie.id}
          {movie.title}
        </Text>
        {/* <Text className="text-text text-center">Date Added: {movie.dateAdded}</Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default MovieContainer;
