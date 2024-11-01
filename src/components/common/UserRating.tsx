import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const BUTTON_WIDTH = 50;
const LEFT_MARGIN = 20;

const positionFactor = Math.floor((width - BUTTON_WIDTH / 2) / 10);

type Props = {
  updateRating: (rating: number) => void;
  rating: number | undefined;
};
const UserRating = ({ updateRating, rating = 0 }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rightEdgeOffset = useSharedValue(0);
  // Supposed to offset Absoultex so that it is considered center of button
  const buttonOffsetx = useSharedValue(0);
  const textScale = useSharedValue(0);
  const isLongPressActive = useSharedValue(false);
  const [currRating, setCurrRating] = React.useState(rating);

  const colorTrans = useSharedValue(0);
  const pan = Gesture.Pan()
    .onChange((event) => {
      "worklet";
      if (isLongPressActive.value) {
        //Check to see if we are off the left or right edge.
        // This is checking the we are on the screen and if both are true
        // then we can save the event.translationX to our translateX share value
        // that is actually moving the rating view.
        // if (
        //   rightEdgeOffset.value + event.translationX > 0 &&
        //   BUTTON_WIDTH + LEFT_MARGIN + event.translationX < width
        // ) {
        //   translateX.value = event.translationX;
        // }
        translateX.value = event.translationX;

        // Now we determine what rating number to show based on the position of the view.
        // some tweaking done, hopefully works on most devices.
        const posAbsoluteX = event.absoluteX + buttonOffsetx.value;
        const newPosition = Math.floor(posAbsoluteX / positionFactor);
        let calcCurrRating = newPosition >= 10 ? 10 : newPosition <= 0 ? 0 : newPosition;

        textScale.value =
          newPosition >= 10 || newPosition <= 0 ? 0 : posAbsoluteX / positionFactor - newPosition;
        if (currRating !== calcCurrRating) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
        runOnJS(setCurrRating)(calcCurrRating);
      }
    })
    .onEnd(() => {
      "worklet";
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      textScale.value = withSpring(0);
      isLongPressActive.value = false;
      runOnJS(updateRating)(currRating);
    });

  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart((event) => {
      "worklet";
      //absoluteX - x = amount left/negative before you hit edge
      // console.log("LP LEdgeOffset", e.absoluteX, e.x);
      rightEdgeOffset.value = event.absoluteX - event.x;
      translateY.value = withSpring(-55);
      buttonOffsetx.value = BUTTON_WIDTH / 2 - event.x;
      isLongPressActive.value = true;
      Haptics.ImpactFeedbackStyle.Medium;
    })
    .onEnd(() => {
      "worklet";
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      isLongPressActive.value = false;
      textScale.value = withSpring(0);
    });

  const gesture = Gesture.Simultaneous(longPress, pan);

  const rStyle = useAnimatedStyle(() => {
    colorTrans.value = withTiming(isLongPressActive.value ? 0 : 1);
    return {
      backgroundColor: interpolateColor(
        colorTrans.value, // Input value (0 or 1)
        [0, 1], // Input range
        ["#eab308", "yellow"] // Output colors
      ),
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isLongPressActive.value ? withSpring(1.5) : withSpring(1) },
      ],
    };
  });
  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(textScale.value, [0, 0.5, 1], [1, 1.5, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });
  return (
    <View className="z-10" style={{ marginLeft: LEFT_MARGIN }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[rStyle, { width: BUTTON_WIDTH, borderRadius: 30 }]}
          className=" bg-yellow-500 flex-row justify-center items-center border border-border"
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
