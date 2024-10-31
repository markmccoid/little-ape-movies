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
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const BUTTON_WIDTH = 40;
const LEFT_MARGIN = 20;

const positionFactor = Math.floor((width - (BUTTON_WIDTH + LEFT_MARGIN)) / 10);
// const positionFactor = Math.floor((width - 60) / 10);

type Props = {
  updateRating: (rating: number) => void;
  rating: number | undefined;
};
const UserRating = ({ updateRating, rating = 0 }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rightEdgeOffset = useSharedValue(0);
  const absX = useSharedValue(0);
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
        if (
          rightEdgeOffset.value + event.translationX > 0 &&
          BUTTON_WIDTH + LEFT_MARGIN + event.translationX < width
        ) {
          translateX.value = event.translationX;
        }

        // Now we determine what rating number to show based on the position of the view.
        // some tweaking done, hopefully works on most devices.
        const posAbsoluteX = event.absoluteX - 12;
        const newPosition = Math.floor(posAbsoluteX / positionFactor);
        let calcCurrRating = newPosition >= 10 ? 10 : newPosition <= 0 ? 0 : newPosition;
        console.log("TS", posAbsoluteX / positionFactor, Math.floor(posAbsoluteX / positionFactor));
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
      translateY.value = withSpring(-45);
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
          scale: interpolate(
            textScale.value,
            [0, 0.25, 0.5, 0.75, 1],
            [1, 1.4, 1.5, 1.2, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <View className="z-10" style={{ marginLeft: LEFT_MARGIN }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[rStyle, { width: BUTTON_WIDTH, height: 30 }]}
          className="rounded-xl bg-yellow-500 flex-row justify-center items-center border border-border"
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
