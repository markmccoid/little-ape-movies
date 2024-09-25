import { Dimensions } from "react-native";

export const getMovieItemSizing = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const MARGIN = 5;
  const EXTRA_HEIGHT = 20;
  const imageWidth = screenWidth / 2.2;
  const imageHeight = imageWidth * 1.5;
  const itemHeight = imageHeight + EXTRA_HEIGHT + MARGIN * 2;
  return { imageWidth, imageHeight, itemHeight, margin: MARGIN, extraHeight: EXTRA_HEIGHT };
};
