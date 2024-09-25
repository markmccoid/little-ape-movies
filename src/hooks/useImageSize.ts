import { Dimensions } from "react-native";

// Plain function that calculates image sizes
function getImageSizes(layout: "2column") {
  const { width: screenWidth } = Dimensions.get("window");
  let imageWidth = 0;
  if (layout === "2column") {
    imageWidth = screenWidth / 2.2;
  }
  const imageHeight = imageWidth * 1.5;
  return { imageWidth, imageHeight };
}

// React hook function
function useImageSize(layout: "2column") {
  return getImageSizes(layout); // Inside React components
}

// Attach static method to the hook for external usage
useImageSize.getSizes = getImageSizes;

export default useImageSize;
