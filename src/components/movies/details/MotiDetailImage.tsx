import { MotiImage, MotiView } from "moti";
import React from "react";
import { Dimensions } from "react-native";
import { FadeInLeft } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");
console.log("WIDTH", width, width * 0.35);
const IMAGE_WIDTH = width * 0.35;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5;
type Props = {
  existsInSaved: boolean;
  posterURL: string | undefined;
};
/**
 *
 */
const MotiDetailImage = ({ existsInSaved, posterURL }: Props) => {
  // Radius once added
  const BORDER_RADIUS_ADDED = 20;
  // Radius when NOT added
  const BORDER_RADIUS_SEARCH = 45;
  return (
    <MotiView
      className=""
      from={{
        borderRadius: existsInSaved ? BORDER_RADIUS_SEARCH : BORDER_RADIUS_ADDED,
        opacity: 0.5,
        translateX: -100,
      }}
      animate={{
        borderRadius: existsInSaved ? BORDER_RADIUS_ADDED : BORDER_RADIUS_SEARCH,
        opacity: 1,
        translateX: 0,
      }}
      transition={{
        type: "timing",
        duration: 600,
      }}
      style={{
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      }}
    >
      <MotiImage
        source={{ uri: posterURL }}
        from={{ borderRadius: existsInSaved ? BORDER_RADIUS_SEARCH : BORDER_RADIUS_ADDED }}
        animate={{
          borderRadius: existsInSaved ? BORDER_RADIUS_ADDED : BORDER_RADIUS_SEARCH,
        }}
        transition={{
          type: "timing",
          duration: 600,
        }}
        style={{
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
        }}
      />
    </MotiView>
  );
};

export default MotiDetailImage;
