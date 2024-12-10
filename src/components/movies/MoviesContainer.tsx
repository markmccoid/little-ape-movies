import React, { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { FlatList } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import useMovieStore, { ShowItemType, useMovieActions, useMovies } from "@/store/store.shows";
import MovieItem from "./movieitem/MovieItem";
import MovieAnimatedView from "./movieitem/MovieAnimatedView";

import { getMovieItemSizing } from "./movieitem/movieItemHelpers";
import { useFocusEffect } from "expo-router";
import { hide } from "expo-splash-screen";

const MoviesContainer = () => {
  // get the itemHeight for building our getItemLayout
  // If you want to change the layout, ONLY do it in th egetMovieItemSizing function
  const { horizontalMargin, itemHeight } = getMovieItemSizing();
  const movies = useMovies();
  const scrollY = useSharedValue(0);
  const flatListRef = React.useRef<FlatList>(null);
  const [hideAll, setHideAll] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const getItemLayout = (data: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => setHideAll(false), 0);
      return () => {
        setTimeout(() => setHideAll(true), 0);
      };
    }, [])
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ShowItemType; index: number }) => {
      return (
        <MovieAnimatedView index={index} scrollY={scrollY}>
          <Animated.View entering={FadeIn.duration(300)}>
            <MovieItem movie={item} hideAll={hideAll} />
          </Animated.View>
        </MovieAnimatedView>
      );
    },
    [hideAll]
  );

  return (
    <Animated.FlatList
      data={movies}
      ref={flatListRef}
      renderItem={renderItem}
      // extraData={hideActionBar}
      // keyExtractor={(item, index) => index.toString()}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      style={{ paddingTop: 10 }}
      columnWrapperStyle={{ marginHorizontal: horizontalMargin }}
      onScroll={scrollHandler}
      getItemLayout={getItemLayout}
    />
  );
};

export default React.memo(MoviesContainer);
