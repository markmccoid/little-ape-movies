import { View, Text, Dimensions, Animated } from "react-native";
import React, { ReactNode } from "react";
import {
  getViewMoviesOpacity,
  getViewMoviesRotates,
  getViewMoviesScale,
  getViewMoviesTranslates,
} from "../../common/animations/animationHelpers";
import useImageSize from "@/hooks/useImageSize";
import { getMovieItemSizing } from "./movieItemHelpers";

const { imageHeight, imageWidth, itemHeight, margin } = getMovieItemSizing();
const MARGIN = margin;
const ITEM_SIZE = itemHeight;

type MovieAnimatedViewProps = {
  index: number;
  offsetY: Animated.Value; // Assuming you're using Animated.Value from React Native
  children: ReactNode; // Allows any valid React child
};

const MovieAnimatedView: React.FC<MovieAnimatedViewProps> = ({ index, offsetY, children }) => {
  // Since we have two rows, this is the correct index
  // index 0,1 -> 0,0  index 2,3 => 1,1  etc...
  const ITEM_INDEX = Math.floor(index / 2);

  const animConstants = {
    itemSize: ITEM_SIZE,
    itemIndex: ITEM_INDEX,
    absIndex: index,
    posterHeight: imageHeight,
    posterWidth: imageWidth,
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
      {children}
    </Animated.View>
  );
};

export default MovieAnimatedView;
