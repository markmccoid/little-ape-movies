import { Dimensions } from "react-native";
//~~ ------------------------------------------------------
//~~ FOR Movie Detail Page
//~~ ------------------------------------------------------
/**
 * Calculates image size for Movie Detail page
 */
const { width: screenWidth } = Dimensions.get("window");
function getDetailImageSizes() {
  const IMAGE_WIDTH = screenWidth * 0.35;
  const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5;
  return { imageWidth: IMAGE_WIDTH, imageHeight: IMAGE_HEIGHT };
}

// React hook function
function useDetailImageSize() {
  return getDetailImageSizes();
}

// Attach static method to the hook for external usage
useDetailImageSize.getSizes = getDetailImageSizes;

export default useDetailImageSize;
