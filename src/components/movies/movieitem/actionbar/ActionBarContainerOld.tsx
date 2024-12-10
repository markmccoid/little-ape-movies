import React, { useEffect, useReducer, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { AnimatePresence, MotiView } from "moti";
import { SquareChevronUp } from "@/lib/icons/SquareChevronUp";
import ActionBarButtons from "./ActionBarButtons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

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
  const movieActions = useMovieActions();
  const initialRender = React.useRef(true);
  const actionHeight = useSharedValue(0);

  const actionHeightFrom = initialRender.current ? 0 : isVisible ? 0 : 175;
  const actionHeightAnimate = initialRender.current ? 0 : isVisible ? 175 : 0;
  actionHeight.value = isVisible ? 175 : 0;

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      console.log("Gesture begin", event.translationY);
    })
    .onUpdate((event) => {
      console.log("UPDATE", event.translationY);
      actionHeight.value = actionHeight.value - event.translationY;
      console.log("ACTION H +_", actionHeight.value);
    })
    .onEnd((event) => {
      console.log("Gesture End", event.translationY);
    });
  return (
    <MotiView
      from={{ height: actionHeightFrom }}
      animate={{ height: actionHeightAnimate }}
      // from={{ height: isShown ? 35 : 85 }}
      // animate={{ height: isShown ? 85 : 35 }}
      transition={{ type: "timing", duration: 500 }}
      className="absolute z-20 h-[35] bottom-0"
      onLayout={() => (initialRender.current = false)}
    >
      <GestureDetector gesture={panGesture}>
        <Pressable
          onPress={toggleVisibility}
          className="justify-center flex-row top-1 z-30 rounded-lg"
        >
          <MotiView
            from={{ rotate: isVisible ? "0deg" : "180deg" }}
            animate={{ rotate: isVisible ? "180deg" : "0deg" }}
            transition={{ type: "timing", duration: 700 }}
          >
            <SquareChevronUp className="color-white bg-black" />
          </MotiView>
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
    </MotiView>
  );
};

export default ActionBarContainer;
