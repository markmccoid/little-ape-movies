import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@/components/common/Icons";
import { NotWatched, Watched } from "../../details/tagMovies/WatchedIcons";
import { Favorited, NotFavorited } from "../../details/tagMovies/FavoriteIcons";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import { useCustomTheme } from "@/lib/colorThemes";
import ActionBarUserRating from "./ActionBarUserRating";

type Props = {
  movie: ShowItemType;
  // Need to know which column for rating animation
  column: 0 | 1;
  handleChangePending: (changeState: boolean) => void;
};
const ActionBarButtons = ({ movie, column, handleChangePending }: Props) => {
  const movieActions = useMovieActions();
  const watched = movie?.watched;
  const favorited = movie?.favorited;
  // const rating = movie?.rating || 0;
  const [localRating, setLocalRating] = useState(movie?.rating || 0);
  const [localWatched, setLocalWatched] = React.useState(!!watched);
  const [localFavorited, setLocalFavorited] = React.useState(!!watched);

  // console.log("Movie", movie.title, localWatched, changeFlag);

  useEffect(() => {
    // console.log("fav/watched Effect", movie.title, localWatched, changeFlag)
    if (localWatched !== !!watched) {
      setLocalWatched(!!watched);
    }
    if (localFavorited !== !!favorited) {
      setLocalFavorited(!!favorited);
    }
  }, [favorited, watched]);

  const handleWatched = () => {
    setLocalWatched((prevWatched) => {
      movieActions.setPendingChanges(movie.id, { watched: prevWatched ? "off" : "on" });
      return !prevWatched;
    });
    handleChangePending(true);
  };
  const handleFavorited = () => {
    setLocalFavorited((prevFavorited) => {
      movieActions.setPendingChanges(movie.id, { favorited: prevFavorited ? "off" : "on" });
      return !prevFavorited;
    });
    handleChangePending(true);
  };

  const handleUserRating = (newRating: number) => {
    movieActions.setPendingChanges(movie.id, { rating: newRating });
    setLocalRating(newRating);
    handleChangePending(true);
  };
  return (
    <View className="flex-row justify-between w-full mt-2 px-2">
      <ActionBarUserRating updateRating={handleUserRating} rating={localRating} column={column} />

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

export default React.memo(ActionBarButtons);
