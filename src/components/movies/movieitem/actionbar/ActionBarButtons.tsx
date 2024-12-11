import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { DeleteIcon } from "@/components/common/Icons";
import { NotWatched, Watched } from "../../details/tagMovies/WatchedIcons";
import { Favorited, NotFavorited } from "../../details/tagMovies/FavoriteIcons";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import { useCustomTheme } from "@/lib/colorThemes";
import ActionBarUserRating from "./ActionBarUserRating";

type Props = { movie: ShowItemType; column: 0 | 1 };
const ActionBarButtons = ({ movie, column }: Props) => {
  const movieActions = useMovieActions();
  const watched = movie?.watched;
  const favorited = movie?.favorited;
  const rating = movie?.rating || 0;
  const [localWatched, setLocalWatched] = React.useState(!!watched);
  const [localFavorited, setLocalFavorited] = React.useState(!!watched);

  useEffect(() => {
    if (localWatched !== !!watched) {
      setLocalWatched(!!watched);
    }
    if (localFavorited !== !!favorited) {
      setLocalFavorited(!!favorited);
    }
  }, [favorited, watched]);

  const handleWatched = () => {
    setLocalWatched((prev) => !prev);
    setTimeout(() => movieActions.toggleWatched(movie.id), 100);
  };
  const handleFavorited = () => {
    setLocalFavorited((prev) => !prev);
    setTimeout(() => movieActions.toggleFavorited(movie.id), 100);
  };

  const handleUserRating = (newRating: number) => {
    movieActions.updateShow(movie.id, { rating: newRating });
  };
  return (
    <View className="flex-row justify-between w-full mt-2 px-2">
      <ActionBarUserRating updateRating={handleUserRating} rating={rating} column={column} />

      {/* <TouchableOpacity onPress={() => movieActions.removeShow(movieId)}>
        <DeleteIcon size={15} color="black" />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={handleWatched}>
        {localWatched ? <Watched /> : <NotWatched />}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFavorited}>
        {localFavorited ? <Favorited /> : <NotFavorited />}
      </TouchableOpacity>
    </View>
  );
};

export default ActionBarButtons;
