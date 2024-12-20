import React, { useEffect, useReducer, useState, useRef } from "react";
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ActionBarTags from "./ActionBarTags";

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
  const actions = useMovieActions();
  const [changePending, setChangePending] = useState(false);
  const MIN_HEIGHT = 0;
  const MIDDLE_HEIGHT = 70;
  const MAX_HEIGHT = 205;
  const initialRender = useRef(true);
  const actionHeight = useSharedValue(MIDDLE_HEIGHT); // Start at MIDDLE
  const startY = useSharedValue(MIN_HEIGHT); // Start at MIDDLE

  const handleVisibilityChange = () => {
    animateVisibilityChange();
    toggleVisibility();
  };

  //~
  const handleChangePending = (changeState: boolean) => {
    setChangePending(changeState);
  };

  const animateVisibilityChange = () => {
    if (isVisible) {
      actionHeight.value = withTiming(MIDDLE_HEIGHT, { duration: 500 });
    } else {
      actionHeight.value = withTiming(MIN_HEIGHT, { duration: 500 });
    }
  };

  useEffect(() => {
    if (initialRender.current) {
      actionHeight.value = withTiming(MIN_HEIGHT, { duration: 0 });
      startY.value = MIN_HEIGHT;
      initialRender.current = false;
    } else {
      animateVisibilityChange();
    }
    if (changePending) {
      actions.commitPendingChanges();
    }
  }, [isVisible]);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      startY.value = actionHeight.value;
    })
    .onUpdate((event) => {
      const newHeight = startY.value - event.translationY;
      actionHeight.value = clamp(newHeight, MIN_HEIGHT, MAX_HEIGHT + 10);
    })
    .onEnd(() => {
      const middleToMaxThreshold = MIDDLE_HEIGHT + (MAX_HEIGHT - MIDDLE_HEIGHT) / 1.9;
      const minToMiddleThreshold = MIN_HEIGHT + (MIDDLE_HEIGHT - MIN_HEIGHT) / 2;
      // console.log("MD", middleToMaxThreshold);
      // console.log("MN", minToMiddleThreshold);
      // console.log("ACT", actionHeight.value);
      let targetHeight;
      if (actionHeight.value > middleToMaxThreshold) {
        targetHeight = MAX_HEIGHT;
      } else if (actionHeight.value > minToMiddleThreshold) {
        targetHeight = MIDDLE_HEIGHT;
      } else {
        targetHeight = MIN_HEIGHT;
        runOnJS(toggleVisibility)();
      }

      actionHeight.value = withSpring(targetHeight);
    });

  const animStyle = useAnimatedStyle(() => {
    return {
      height: actionHeight.value,
    };
  });

  const iconAnimStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      actionHeight.value,
      [MIN_HEIGHT, MIDDLE_HEIGHT, MAX_HEIGHT],
      [0, 0, 180]
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <Animated.View style={[animStyle]} className="absolute z-20 h-[35] bottom-0">
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
        <ActionBarButtons movie={movie} column={column} handleChangePending={handleChangePending} />
        <View className="h-[10]" />
        <ActionBarTags movieId={movie.id} handleChangePending={handleChangePending} />
        {/* <ActionInfoPanel movie={movie} /> */}
      </MotiView>
    </Animated.View>
  );
};

export default ActionBarContainer;
