import { View, Text, Dimensions, FlatList } from "react-native";
import React from "react";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import MovieItem from "./movieitem/MovieItem";
import MovieAnimatedView from "./movieitem/MovieAnimatedView";

const { width } = Dimensions.get("window");
const POSTER_WIDTH = width / 2.2;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
const MARGIN = 5;
const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;

const MoviesContainer = () => {
  const movies = useMovieStore((state) => state.shows);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.FlatList
      data={movies}
      renderItem={({ item, index }) => (
        <MovieAnimatedView index={index} scrollY={scrollY}>
          <MovieItem movie={item} />
        </MovieAnimatedView>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      style={{ paddingTop: 10 }}
      columnWrapperStyle={{ justifyContent: "space-around" }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    />
  );
};

export default MoviesContainer;
