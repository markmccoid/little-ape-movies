import React, { useEffect, useReducer, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { AnimatePresence, MotiView } from "moti";
import { SquareChevronUp } from "@/lib/icons/SquareChevronUp";
import ActionBarButtons from "./ActionBarButtons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type MovieItemActionBarProps = {
  movie: ShowItemType;
  isVisible: boolean;
  toggleVisibility: () => void;
};

const ActionBarContainer: React.FC<MovieItemActionBarProps> = ({
  movie,
  isVisible,
  toggleVisibility,
}) => {
  const MIN_HEIGHT = 0;
  const MAX_HEIGHT = 185;
  const movieActions = useMovieActions();
  const initialRender = React.useRef(true);
  const actionHeight = useSharedValue(MIN_HEIGHT);

  const actionHeightFrom = initialRender.current ? 0 : isVisible ? 0 : 175;
  const actionHeightAnimate = initialRender.current ? 0 : isVisible ? 175 : 0;
  // actionHeight.value = isVisible ? 175 : 0;
  const startY = useSharedValue(MIN_HEIGHT);

  const handleVisibilityChange = () => {
    console.log("handleVisibi", actionHeight.value);
    if (isVisible) {
      actionHeight.value = withTiming(MIN_HEIGHT);
    } else {
      actionHeight.value = withTiming(MAX_HEIGHT);
    }
    toggleVisibility();
  };

  useEffect(() => {
    if (isVisible) {
      actionHeight.value = withTiming(MAX_HEIGHT, { duration: 500 });
    } else {
      actionHeight.value = withTiming(MIN_HEIGHT, { duration: 500 });
    }
  }, [isVisible]);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      // Store the initial height when gesture begins
      startY.value = actionHeight.value;
    })
    .onUpdate((event) => {
      // Calculate new height based on translation
      // Negative translationY means pulling down (increasing height)
      const newHeight = startY.value - event.translationY;
      // Clamp the height between min and max values
      actionHeight.value = clamp(newHeight, MIN_HEIGHT, MAX_HEIGHT);
    })
    .onEnd(() => {
      // Optional: Spring back to min or max height
      const stayOpen = actionHeight.value > MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) / 2;
      actionHeight.value = withTiming(
        // actionHeight.value > MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) / 2 ? MAX_HEIGHT : MIN_HEIGHT
        stayOpen ? MAX_HEIGHT : MIN_HEIGHT
      );
      if (!stayOpen) {
        runOnJS(toggleVisibility)();
      }
    });

  const animStyle = useAnimatedStyle(() => {
    return {
      height: actionHeight.value,
    };
  });
  // Icon rotation animated style
  const iconAnimStyle = useAnimatedStyle(() => {
    // Interpolate rotation based on height
    const rotation = interpolate(
      actionHeight.value,
      [MIN_HEIGHT, MAX_HEIGHT / 2, MAX_HEIGHT], // Input range
      [0, 0, 180] // Output range (degrees)
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <Animated.View
      style={[animStyle]}
      className="absolute z-20 h-[35] bottom-0"
      onLayout={() => (initialRender.current = false)}
    >
      <GestureDetector gesture={panGesture}>
        <Pressable
          onPress={handleVisibilityChange}
          className="justify-center flex-row top-1 z-30 rounded-lg"
        >
          <Animated.View
            style={[iconAnimStyle]}
            // from={{ rotateZ: isVisible ? "0deg" : "180deg" }}
            // animate={{ rotateZ: isVisible ? "180deg" : "0deg" }}
            // transition={{ type: "timing", duration: 1500 }}
          >
            <SquareChevronUp className="color-white bg-black" />
          </Animated.View>
        </Pressable>
      </GestureDetector>
      <MotiView
        // from={{ height: isShown ? 35 : 65 }}
        // animate={{ height: isShown ? 65 : 35 }}
        // transition={{ type: "timing", duration: 1000 }}
        from={{ opacity: isVisible ? 0 : 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ type: "timing", duration: 700 }}
        // exit={{ opacity: isShown ? 1 : 0 }}
        className="z-10 flex-row w-full bg-red-500  items-center justify-between h-full border"
      >
        <View className="flex-row w-full bg-red-500 items-start justify-between h-full mt-2">
          <ActionBarButtons movieId={movie.id} />
        </View>
      </MotiView>
    </Animated.View>
  );
};

export default ActionBarContainer;
