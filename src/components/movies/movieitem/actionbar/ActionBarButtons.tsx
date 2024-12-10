import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { DeleteIcon } from "@/components/common/Icons";
import { NotWatched, Watched } from "../../details/tagMovies/WatchedIcons";
import { Favorited, NotFavorited } from "../../details/tagMovies/FavoriteIcons";
import { useMovieActions } from "@/store/store.shows";
import { useCustomTheme } from "@/lib/colorThemes";

type Props = { movieId: number };
const ActionBarButtons = ({ movieId }: Props) => {
  const movieActions = useMovieActions();
  const watched = movieActions.getShowById(movieId)?.watched;
  const favorited = movieActions.getShowById(movieId)?.favorited;
  const [localWatched, setLocalWatched] = React.useState(!!watched);
  const [localFavorited, setLocalFavorited] = React.useState(!!watched);
  // const [isShown, toggleIsShown] = useReducer((state) => !state, false);
  const initialRender = React.useRef(true);

  useEffect(() => {
    if (localWatched !== !!watched) {
      setLocalWatched(!!watched);
    }
    if (localFavorited !== !!favorited) {
      setLocalFavorited(!!favorited);
    }
  }, [favorited]);

  const handleWatched = () => {
    setLocalWatched((prev) => !prev);
    setTimeout(() => movieActions.toggleWatched(movieId), 100);
  };
  const handleFavorited = () => {
    setLocalFavorited((prev) => !prev);
    setTimeout(() => movieActions.toggleFavorited(movieId), 100);
  };
  return (
    <View className="flex-row">
      <TouchableOpacity onPress={() => console.log("Action Press")}>
        <Text className="text-white text-center">Action Bar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => movieActions.removeShow(movieId)}>
        <DeleteIcon size={15} color="black" />
      </TouchableOpacity>
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
