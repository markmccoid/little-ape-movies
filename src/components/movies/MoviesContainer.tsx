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
      const column = (index % 2) as 0 | 1;

      return (
        <MovieAnimatedView index={index} scrollY={scrollY}>
          <Animated.View entering={FadeIn.duration(300)}>
            <MovieItem movie={item} hideAll={hideAll} column={column} />
          </Animated.View>
        </MovieAnimatedView>
      );
    },
    [hideAll, movies]
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
