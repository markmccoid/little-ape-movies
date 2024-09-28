import { interpolate, Extrapolate } from "react-native-reanimated";

//* Helpers to get animation values for use in the main flatlist that displays movies.

export const getViewMoviesRotates = (scrollY, animConstants) => {
  "worklet";
  const { itemSize, itemIndex } = animConstants;
  const rotateInputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 2)];

  const rotateY = interpolate(
    scrollY,
    rotateInputRange,
    ["0deg", "0deg", "0deg", "90deg"],
    Extrapolate.CLAMP
  );
  const rotateX = interpolate(
    scrollY,
    rotateInputRange,
    ["0deg", "0deg", "0deg", "10deg"],
    Extrapolate.CLAMP
  );
  const rotateZ = interpolate(
    scrollY,
    rotateInputRange,
    ["0deg", "0deg", "0deg", "25deg"],
    Extrapolate.CLAMP
  );

  return [rotateX, rotateY, rotateZ];
};

export const getViewMoviesTranslates = (scrollY, animConstants) => {
  "worklet";
  const { itemSize, itemIndex, absIndex, posterHeight, posterWidth, margin } = animConstants;
  const inputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 4)];
  const xOut = absIndex % 2 === 0 ? (posterWidth - margin) / 2 : ((posterWidth - margin) / 2) * -1;

  const translateX = interpolate(scrollY, inputRange, [0, 0, 0, xOut], Extrapolate.CLAMP);

  const yOut = (posterHeight - margin * 2) / 2;
  const translateY = interpolate(scrollY, inputRange, [0, 0, 0, yOut], Extrapolate.CLAMP);

  return [translateX, translateY];
};

export const getViewMoviesScale = (scrollY, animConstants) => {
  "worklet";
  const { itemSize, itemIndex } = animConstants;
  const inputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 4)];

  return interpolate(scrollY, inputRange, [1, 1, 1, 0], Extrapolate.CLAMP);
};

export const getViewMoviesOpacity = (scrollY, animConstants) => {
  "worklet";
  const { itemSize, itemIndex } = animConstants;

  return interpolate(
    scrollY,
    [itemSize * itemIndex, itemSize * (itemIndex + 0.6), itemSize * (itemIndex + 1)],
    [1, 0.8, 0.2],
    Extrapolate.CLAMP
  );
};
