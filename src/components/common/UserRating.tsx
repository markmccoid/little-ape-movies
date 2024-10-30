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
const positionFactor = Math.floor((width - 40) / 10);

type Props = {
  updateRating: (rating: number) => void;
  rating: number | undefined;
};
const UserRating = ({ updateRating, rating = 0 }: Props) => {
  console.log("R", rating);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const absX = useSharedValue(0);
  const textScale = useSharedValue(0);
  const isLongPressActive = useSharedValue(false);
  const [currRating, setCurrRating] = React.useState(rating);

  const colorTrans = useSharedValue(0);
  const maxTranslateX = width - 60;
  const pan = Gesture.Pan()
    .onChange((event) => {
      "worklet";
      if (isLongPressActive.value) {
        // translateX.value = event.translationX;
        translateX.value = Math.max(-10, Math.min(333, event.translationX));
        let absoluteX = event.absoluteX;
        if (translateX.value === -10 || translateX.value === 333) {
          absoluteX = absX.value;
        } else {
          absX.value = event.absoluteX;
        }
        textScale.value = absoluteX / positionFactor - Math.floor(absoluteX / positionFactor);
        // console.log("W", width - 60, event.translationX, event.absoluteX);
        // console.log("M", Math.max(0, Math.min(maxTranslateX, event.translationX)));
        console.log("PAN AB", event.absoluteX);
        let calcCurrRating =
          Math.floor(absoluteX / positionFactor) >= 10
            ? 10
            : Math.floor(absoluteX / positionFactor);
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
    .onStart((e) => {
      "worklet";
      console.log("LP AB", e.x, e.absoluteX, width - 55 - 35 / 2);
      translateY.value = withSpring(-35);
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
        { scale: isLongPressActive.value ? withSpring(1.4) : withSpring(1) },
      ],
    };
  });
  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(textScale.value, [0, 1, 0], [1, 1.5, 1], Extrapolation.CLAMP) },
      ],
    };
  });
  return (
    <View className="ml-5 z-10">
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[rStyle, { width: 40, height: 30 }]}
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
