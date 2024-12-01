import React, { useEffect, useReducer } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { AnimatePresence, MotiView } from "moti";
import { DeleteIcon } from "@/components/common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { MotiNotWatched, MotiWatched } from "../details/tagMovies/MotiWatchedIcons";
import { MotiFavorited, MotiNotFavorited } from "../details/tagMovies/MotiFavoriteIcons";
import { SquareChevronUp } from "@/lib/icons/SquareChevronUp";
type MovieItemActionBarProps = {
  movie: ShowItemType;
  isVisible: boolean;
};

const MovieItemActionBar: React.FC<MovieItemActionBarProps> = ({ movie, isVisible }) => {
  const movieActions = useMovieActions();
  const watched = movieActions.getShowById(movie.id)?.watched;
  const favorited = movieActions.getShowById(movie.id)?.favorited;
  const [localWatched, setLocalWatched] = React.useState(!!watched);
  const [localFavorited, setLocalFavorited] = React.useState(!!watched);
  const [isShown, toggleIsShown] = useReducer((state) => !state, false);

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
    setTimeout(() => movieActions.toggleWatched(movie.id), 100);
  };
  const handleFavorited = () => {
    setLocalFavorited((prev) => !prev);
    setTimeout(() => movieActions.toggleFavorited(movie.id), 100);
  };
  return (
    <MotiView
      from={{ height: isShown ? 35 : 85 }}
      animate={{ height: isShown ? 85 : 35 }}
      transition={{ type: "timing", duration: 700 }}
      className="absolute z-20 h-[35] bottom-0"
    >
      <Pressable onPress={toggleIsShown} className="justify-center flex-row top-3 z-30">
        <MotiView
          from={{ rotate: isShown ? "0deg" : "180deg" }}
          animate={{ rotate: isShown ? "180deg" : "0deg" }}
          transition={{ type: "timing", duration: 700 }}
        >
          <SquareChevronUp className="color-white bg-black" />
        </MotiView>
      </Pressable>

      <MotiView
        // from={{ height: isShown ? 35 : 65 }}
        // animate={{ height: isShown ? 65 : 35 }}
        // transition={{ type: "timing", duration: 1000 }}
        from={{ opacity: isShown ? 0 : 1 }}
        animate={{ opacity: isShown ? 1 : 0 }}
        transition={{ type: "timing", duration: 700 }}
        // exit={{ opacity: isShown ? 1 : 0 }}
        className="z-10 flex-row w-full bg-red-500  items-center justify-between h-full border"
      >
        <View className="flex-row w-full bg-red-500  items-center justify-between h-full ">
          <TouchableOpacity onPress={() => console.log("Action Press")}>
            <Text className="text-white text-center">Action Bar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => movieActions.removeShow(movie.id)}>
            <DeleteIcon size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWatched}>
            <AnimatePresence>{localWatched ? <MotiWatched /> : <MotiNotWatched />}</AnimatePresence>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavorited}>
            <AnimatePresence>
              {localFavorited ? <MotiFavorited /> : <MotiNotFavorited />}
            </AnimatePresence>
          </TouchableOpacity>
        </View>
      </MotiView>
    </MotiView>
  );
};

export default MovieItemActionBar;
