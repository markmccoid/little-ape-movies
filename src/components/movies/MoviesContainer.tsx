import { View, Text, Dimensions, FlatList, Animated } from "react-native";
import React from "react";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import MovieItem from "./movieitem/MovieItem";
import {
  getViewMoviesOpacity,
  getViewMoviesRotates,
  getViewMoviesScale,
  getViewMoviesTranslates,
} from "@/components/common/animations/animationHelpers";
import MovieAnimatedView from "./movieitem/MovieAnimatedView";

const { width, height } = Dimensions.get("window");
const POSTER_WIDTH = width / 2.2;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Height is 1.5 times the width
const MARGIN = 5;
const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;

type Props = {
  movie: ShowItemType;
};
const MoviesContainer = () => {
  const movies = useMovieStore((state) => state.shows);

  const offsetY = React.useRef(new Animated.Value(0)).current;

  const flatListRenderItem = React.useCallback(
    ({ item, index }: { item: ShowItemType; index: number }) => {
      const pURL = item.posterURL;
      // Since we have two rows, this is the correct index
      // index 0,1 -> 0,0  index 2,3 => 1,1  etc...
      const ITEM_INDEX = Math.floor(index / 2);

      const animConstants = {
        itemSize: ITEM_SIZE,
        itemIndex: ITEM_INDEX,
        absIndex: index,
        posterHeight: POSTER_HEIGHT,
        posterWidth: POSTER_WIDTH,
        margin: MARGIN,
      };

      const scale = getViewMoviesScale(offsetY, animConstants);
      const opacity = getViewMoviesOpacity(offsetY, animConstants);
      const [translateX, translateY] = getViewMoviesTranslates(offsetY, animConstants);
      const [rotateX, rotateY, rotateZ] = getViewMoviesRotates(offsetY, animConstants);
      const animStyle = {
        transform: [
          { scale },
          { translateX },
          { translateY },
          // { rotateX },
          // { rotateY },
          // { rotateZ },
        ],
      };
      return (
        <Animated.View
          style={{
            opacity,
            ...animStyle,
          }}
        >
          <MovieItem movie={item} />
        </Animated.View>
      );
    },
    []
  );

  return (
    <FlatList
      data={movies}
      // renderItem={flatListRenderItem}
      renderItem={({ item, index }) => (
        <MovieAnimatedView index={index} offsetY={offsetY}>
          <MovieItem movie={item} />
        </MovieAnimatedView>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      style={{ paddingTop: 10 }}
      columnWrapperStyle={{ justifyContent: "space-around" }}
      onScroll={(e) => {
        // show or hide search input
        // if (e.nativeEvent.contentOffset.y < -50) {
        //   setShowSearch(true);
        // } else if (e.nativeEvent.contentOffset.y > 50 && !searchFilter) {
        //   setShowSearch(false);
        // }
        offsetY.setValue(e.nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={16}
    />
  );
};

export default MoviesContainer;
