import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import useImageSize from "@/hooks/useImageSize";

const { width, height } = Dimensions.get("window");
const BUTTON_WIDTH = 30;
const LEFT_MARGIN = 0;

type Props = {
  updateRating: (rating: number) => void;
  rating: number | undefined;
  column: 0 | 1;
};
const UserRating = ({ updateRating, rating = 0, column }: Props) => {
  const { imageHeight, imageWidth, gap } = useImageSize();
  const positionFactor = Math.floor((imageWidth - BUTTON_WIDTH / 2) / 10);
  const { colors } = useCustomTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isPanActive = useSharedValue(false);
  const colorTrans = useSharedValue(0);
  // Supposed to offset Absoultex so that it is considered center of button
  const buttonOffsetx = useSharedValue(0);
  const textScale = useSharedValue(0);
  const [currRating, setCurrRating] = React.useState(rating);
  const columnOffset = column === 1 ? gap * 2 + imageWidth : gap;

  React.useEffect(() => {
    setCurrRating(rating);
  }, [rating]);
  const gesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .onStart((event) => {
      "worklet";
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      translateY.value = withSpring(-35);
      buttonOffsetx.value = BUTTON_WIDTH / 4 - event.x;
      isPanActive.value = true;
    })
    .onChange((event) => {
      "worklet";
      // Define a right and left absolute value threshold for an image
      // based on which column it is in
      const rightThreshold = column === 1 ? width - 15 : imageWidth + 15;
      const leftThreshold = column === 1 ? width - 15 - imageWidth : 15;
      // Only update translateX.value to the new event.translationX IF absoluteX is in
      // the bounds of our right/left threshold values
      translateX.value =
        event.absoluteX >= leftThreshold && event.absoluteX <= rightThreshold
          ? event.translationX
          : translateX.value; // Keep the last value if out of bounds

      // Now we determine what rating number to show based on the position of the view.
      // some tweaking done, hopefully works on most devices.
      const posAbsoluteX = event.absoluteX + buttonOffsetx.value - columnOffset;

      const newPosition = Math.floor(posAbsoluteX / positionFactor);
      let calcCurrRating = newPosition >= 10 ? 10 : newPosition <= 0 ? 0 : newPosition;

      textScale.value =
        newPosition >= 10 || newPosition <= 0 ? 0 : posAbsoluteX / positionFactor - newPosition;
      if (currRating !== calcCurrRating) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
      runOnJS(setCurrRating)(calcCurrRating);
    })
    .onEnd(() => {
      ("worklet");
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      textScale.value = withSpring(0);
      isPanActive.value = false;
      runOnJS(updateRating)(currRating);
    });

  const rStyle = useAnimatedStyle(() => {
    colorTrans.value = withTiming(isPanActive.value ? 0 : 1);
    return {
      backgroundColor: interpolateColor(
        colorTrans.value, // Input value (0 or 1)
        [0, 1], // Input range
        [colors.secondary, colors.primary] // Output colors
      ),
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isPanActive.value ? withSpring(1.5) : withSpring(1) },
      ],
    };
  });
  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        colorTrans.value, // Input value (0 or 1)
        [0, 1], // Input range
        ["black", "white"] // Output colors
      ),
      transform: [
        {
          scale: interpolate(textScale.value, [0, 0.5, 1], [1, 1.5, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });
  return (
    <View className="relative z-50" style={{ marginLeft: LEFT_MARGIN }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[rStyle, { width: BUTTON_WIDTH, borderRadius: 30 }]}
          className="bg-primary flex-row justify-center items-center border border-border"
        >
          <Animated.Text style={textStyle} className="text-xl font-bold">
            {currRating}
          </Animated.Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default UserRating;
