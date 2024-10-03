import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import { DeleteIcon } from "@/components/common/Icons";

type MovieItemActionBarProps = {
  movie: ShowItemType;
};

const MovieItemActionBar: React.FC<MovieItemActionBarProps> = ({ movie }) => {
  const movieActions = useMovieActions();
  return (
    <View className="flex-row w-full bg-red-500 rounded-b-lg items-center justify-between h-full">
      <TouchableOpacity onPress={() => console.log("Action Press")}>
        <Text className="text-white text-center">Action Bar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.removeShow(movie.id)}>
        <DeleteIcon size={15} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default MovieItemActionBar;
