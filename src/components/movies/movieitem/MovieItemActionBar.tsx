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
import { Eye } from "@/lib/icons/Eye";
import { EyeClosed } from "@/lib/icons/EyeClosed";

type MovieItemActionBarProps = {
  movie: ShowItemType;
};

const MovieItemActionBar: React.FC<MovieItemActionBarProps> = ({ movie }) => {
  const movieActions = useMovieActions();
  const watched = movieActions.getShowById(movie.id)?.watched;
  const favorited = movieActions.getShowById(movie.id)?.favorited;

  return (
    <View className="flex-row w-full bg-red-500  items-center justify-between h-full border">
      <TouchableOpacity onPress={() => console.log("Action Press")}>
        <Text className="text-white text-center">Action Bar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.removeShow(movie.id)}>
        <DeleteIcon size={15} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => movieActions.toggleWatched(movie.id)}
        style={{ borderWidth: 1 }}
      >
        {watched ? <Eye className="text-white" /> : <EyeClosed className="text-black" />}
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
