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
import UserRating from "@/components/common/UserRating";
import ActionBarUserRating from "./ActionBarUserRating";
import ActionInfoPanel from "./ActionInfoPanel";
import ActionBarDelete from "./ActionBarDelete";

type MovieItemActionBarProps = {
  movie: ShowItemType;
  column: 0 | 1;
  isVisible: boolean;
  toggleVisibility: () => void;
};

const ActionBarContainer: React.FC<MovieItemActionBarProps> = ({
  movie,
  isVisible,
  toggleVisibility,
  column,
}) => {
  const MIN_HEIGHT = 0;
  const MAX_HEIGHT = 185;
  const initialRender = React.useRef(true);
  const actionHeight = useSharedValue(MIN_HEIGHT);

  // const movieActions = useMovieActions();
  // const actionHeightFrom = initialRender.current ? 0 : isVisible ? 0 : 175;
  // const actionHeightAnimate = initialRender.current ? 0 : isVisible ? 175 : 0;
  // actionHeight.value = isVisible ? 175 : 0;
  const startY = useSharedValue(MIN_HEIGHT);

  const handleVisibilityChange = () => {
    // if (isVisible) {
    //   actionHeight.value = withTiming(MIN_HEIGHT);
    // } else {
    //   actionHeight.value = withTiming(MAX_HEIGHT);
    // }
    animateVisibilityChange();
    toggleVisibility();
  };

  const animateVisibilityChange = () => {
    if (isVisible) {
      actionHeight.value = withTiming(MAX_HEIGHT, { duration: 500 });
    } else {
      actionHeight.value = withTiming(MIN_HEIGHT, { duration: 500 });
    }
  };

  useEffect(() => {
    animateVisibilityChange();
    // if (isVisible) {
    //   actionHeight.value = withTiming(MAX_HEIGHT, { duration: 500 });
    // } else {
    //   actionHeight.value = withTiming(MIN_HEIGHT, { duration: 500 });
    // }
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
          className="justify-center flex-row top-0 rounded-lg"
        >
          <Animated.View style={[iconAnimStyle]}>
            <SquareChevronUp className="color-white bg-black" />
          </Animated.View>
        </Pressable>
      </GestureDetector>
      <MotiView
        from={{ opacity: isVisible ? 0 : 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ type: "timing", duration: 700 }}
        className="z-20 flex-col w-full bg-purple-300 items-start h-full border-hairline "
        style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      >
        <ActionBarButtons movie={movie} column={column} isVisible={isVisible} />
        <ActionBarDelete movieId={movie.id} />
        <ActionInfoPanel movie={movie} />
      </MotiView>
    </Animated.View>
  );
};

export default ActionBarContainer;
