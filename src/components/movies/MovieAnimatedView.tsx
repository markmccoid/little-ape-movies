import { View, Text, Dimensions, Animated } from "react-native";
import React from "react";
import {
  getViewMoviesOpacity,
  getViewMoviesRotates,
  getViewMoviesScale,
  getViewMoviesTranslates,
} from "../common/animations/animationHelpers";

const { width, height } = Dimensions.get("window");
const POSTER_WIDTH = width / 2.2;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Height is 1.5 times the width
const MARGIN = 5;
const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;
const MovieAnimatedView = ({ index, offsetY, children }) => {
  // const pURL = item.posterURL;
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
      {children}
    </Animated.View>
  );
};

export default MovieAnimatedView;
