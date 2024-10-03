import React, { useCallback, useState, useEffect } from "react";
import { FlatList } from "react-native";
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
import useImageSize from "@/hooks/useImageSize";
import { getMovieItemSizing } from "./movieitem/movieItemHelpers";

// const { width } = Dimensions.get("window");
// const POSTER_WIDTH = width / 2.2;
// const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
// const MARGIN = 5;
// const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;

const MoviesContainer = () => {
  // get the itemHeight for building our getItemLayout
  // If you want to change the layout, ONLY do it in th egetMovieItemSizing function
  const { horizontalMargin, itemHeight } = getMovieItemSizing();
  const movies = useMovieStore((state) => state.shows);
  const scrollY = useSharedValue(0);
  const flatListRef = React.useRef<FlatList>(null);

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

  // useEffect(() => {
  //   if (flatListRef?.current) {
  //     flatListRef.current.scrollToIndex({ index: 15, animated: true });
  //   }
  // }, [flatListRef?.current]);

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
      ref={flatListRef}
      renderItem={renderItem}
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
