import React, { ReactNode } from "react";
import Animated, { useAnimatedStyle, SharedValue, FadeOut, FadeIn } from "react-native-reanimated";
import {
  getViewMoviesOpacity,
  getViewMoviesRotates,
  getViewMoviesScale,
  getViewMoviesTranslates,
} from "../../common/animations/animationHelpers";
import { getMovieItemSizing } from "./movieItemHelpers";

const { imageHeight, imageWidth, itemHeight, verticalMargin } = getMovieItemSizing();
const MARGIN = verticalMargin;
const ITEM_SIZE = itemHeight;

type MovieAnimatedViewProps = {
  index: number;
  scrollY: SharedValue<number>;
  children: ReactNode;
};

const MovieAnimatedView: React.FC<MovieAnimatedViewProps> = ({ index, scrollY, children }) => {
  const ITEM_INDEX = Math.floor(index / 2);

  const animConstants = {
    itemSize: ITEM_SIZE,
    itemIndex: ITEM_INDEX,
    absIndex: index,
    posterHeight: imageHeight,
    posterWidth: imageWidth,
    margin: MARGIN,
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = getViewMoviesScale(scrollY.value, animConstants);
    const opacity = getViewMoviesOpacity(scrollY.value, animConstants);
    const [translateX, translateY] = getViewMoviesTranslates(scrollY.value, animConstants);
    // const [rotateX, rotateY, rotateZ] = getViewMoviesRotates(scrollY.value, animConstants);

    return {
      opacity,
      transform: [{ scale }, { translateX }, { translateY }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default MovieAnimatedView;
