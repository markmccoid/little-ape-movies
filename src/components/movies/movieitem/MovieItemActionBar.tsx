import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import {
  DeleteIcon,
  EyeOffOutlineIcon,
  EyeOutlineIcon,
  StarFilledIcon,
  StarUnFilledIcon,
} from "@/components/common/Icons";
import { StarIcon } from "lucide-react-native";

type MovieItemActionBarProps = {
  movie: ShowItemType;
};

const MovieItemActionBar: React.FC<MovieItemActionBarProps> = ({ movie }) => {
  const movieActions = useMovieActions();
  const watched = movieActions.getShowById(movie.id)?.watched;
  const favorited = movieActions.getShowById(movie.id)?.favorited;

  return (
    <View className="flex-row w-full bg-red-500 rounded-b-lg items-center justify-between h-full">
      <TouchableOpacity onPress={() => console.log("Action Press")}>
        <Text className="text-white text-center">Action Bar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.removeShow(movie.id)}>
        <DeleteIcon size={15} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.toggleWatched(movie.id)}>
        {watched ? (
          <EyeOutlineIcon size={15} color="black" />
        ) : (
          <EyeOffOutlineIcon size={15} color="black" />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.toggleFavorited(movie.id)}>
        {favorited ? (
          <StarFilledIcon size={15} color="black" />
        ) : (
          <StarUnFilledIcon size={15} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MovieItemActionBar;
