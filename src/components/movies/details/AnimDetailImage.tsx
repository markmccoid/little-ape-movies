import useDetailImageSize from "@/hooks/useDetailImageSize";
import { MotiImage, MotiView } from "moti";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withReanimatedTimer,
  withTiming,
} from "react-native-reanimated";

type Props = {
  existsInSaved: boolean;
  posterURL: string | undefined;
};
/**
 *
 */
// Radius once added
const BORDER_RADIUS_SAVED = 20;
// Radius when NOT added
const BORDER_RADIUS_UNSAVED = 45;
const AnimDetailImage = ({ existsInSaved, posterURL }: Props) => {
  // All of the shouldRender/requestAnimation frame is to try and get the animation
  // of the radius to be smooth.
  const borderRadius = useSharedValue(existsInSaved ? BORDER_RADIUS_SAVED : BORDER_RADIUS_UNSAVED);
  React.useEffect(() => {
    requestAnimationFrame(
      () =>
        (borderRadius.value = withTiming(
          existsInSaved ? BORDER_RADIUS_SAVED : BORDER_RADIUS_UNSAVED,
          { duration: 600 }
        ))
    );
  }, [existsInSaved]);

  const { imageWidth, imageHeight } = useDetailImageSize();

  const radiusStyle = useAnimatedStyle(() => {
    return {
      borderRadius: borderRadius.value,
    };
  });
  return (
    <Animated.View
      className=""
      style={[
        radiusStyle,
        {
          width: imageWidth,
          height: imageHeight,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        },
      ]}
    >
      <Animated.Image
        source={{ uri: posterURL }}
        style={[
          radiusStyle,
          {
            width: imageWidth,
            height: imageHeight,
            resizeMode: "contain",
          },
        ]}
      />
    </Animated.View>
  );
};

export default AnimDetailImage;
