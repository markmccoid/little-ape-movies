import React, { useCallback, useState, useEffect } from "react";
import { Dimensions, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
  FadeOut,
  Layout,
  LinearTransition,
  FadeIn,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
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

  const renderItem = useCallback(
    ({ item, index }: { item: ShowItemType; index: number }) => (
      <MovieAnimatedView index={index} scrollY={scrollY}>
        <MovieItem movie={item} />
      </MovieAnimatedView>
    ),
    []
  );

  return (
    <Animated.FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      style={{ paddingTop: 10 }}
      columnWrapperStyle={{ justifyContent: "space-around" }}
      onScroll={scrollHandler}
    />
  );
};

export default React.memo(MoviesContainer);
