import useImageSize from "@/hooks/useImageSize";
import { Dimensions } from "react-native";

export const getMovieItemSizing = () => {
  // Size the image for 2 columns 15 margin on each side and 10 unit gap in between
  const horizontalMargin = 15;
  const gap = 10;
  const { imageHeight, imageWidth } = useImageSize.getSizes(2, horizontalMargin, gap);

  const verticalMargin = 8;
  const EXTRA_HEIGHT = 0;
  // ItemHeight includes the margin
  const itemHeight = imageHeight + EXTRA_HEIGHT + verticalMargin * 2;
  return {
    imageWidth,
    imageHeight,
    itemHeight,
    verticalMargin,
    extraHeight: EXTRA_HEIGHT,
    horizontalMargin,
    gap,
  };
};
