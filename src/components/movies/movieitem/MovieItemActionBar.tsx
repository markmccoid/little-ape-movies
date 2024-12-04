import React, { useEffect, useReducer, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { AnimatePresence, MotiView } from "moti";
import { DeleteIcon } from "@/components/common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { NotWatched, Watched } from "../details/tagMovies/WatchedIcons";
import { Favorited, NotFavorited } from "../details/tagMovies/FavoriteIcons";
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
    setTimeout(() => movieActions.toggleWatched(movie.id), 100);
  };
  const handleFavorited = () => {
    setLocalFavorited((prev) => !prev);
    setTimeout(() => movieActions.toggleFavorited(movie.id), 100);
  };
  const actionHeightFrom = initialRender.current ? undefined : isShown ? 35 : 85;
  const actionHeightAnimate = initialRender.current ? undefined : isShown ? 85 : 35;

  return (
    <MotiView
      from={{ height: actionHeightFrom }}
      animate={{ height: actionHeightAnimate }}
      // from={{ height: isShown ? 35 : 85 }}
      // animate={{ height: isShown ? 85 : 35 }}
      transition={{ type: "timing", duration: 700 }}
      className="absolute z-20 h-[35] bottom-0"
      onLayout={() => (initialRender.current = false)}
    >
      <Pressable onPress={toggleIsShown} className="justify-center flex-row top-3 z-30 rounded-lg">
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
            {localWatched ? <Watched /> : <NotWatched />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavorited}>
            {localFavorited ? <Favorited /> : <NotFavorited />}
          </TouchableOpacity>
        </View>
      </MotiView>
    </MotiView>
  );
};

export default MovieItemActionBar;
