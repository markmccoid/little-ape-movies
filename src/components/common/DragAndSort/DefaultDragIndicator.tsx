/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Text, View } from "react-native";
import Animated, {
  withDelay,
  withSpring,
  withTiming,
  type EntryExitAnimationFunction,
} from "react-native-reanimated";

export type DragIndicatorConfig = {
  translateXDistance: number;
  indicatorBackgroundColor: string;
  indicatorBorderWidth: number;
  indicatorBorderColor: string;
  indicatorBorderRadius: number;
};

export type DragIndicatorProps = {
  itemHeight: number;
  fromLeftOrRight?: "left" | "right";
  currentPosition: number;
  totalItems: number;
  config: Partial<DragIndicatorConfig>;
};

const defaultDragConfig = {
  translateXDistance: 10,
  indicatorBorderWidth: 1,
  indicatorBorderColor: "black",
  indicatorBackgroundColor: "#eee",
  indicatorBorderRadius: 10,
};

const indicatorSpring = {
  damping: 10,
  mass: 1,
  stiffness: 100,
};

const positionScaleEntering: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: {
      transform: [{ scale: 2.25 }],
    },
    animations: {
      transform: [{ scale: withTiming(1.5, { duration: 500 }) }],
    },
  };
};

function createIndicatorEntering(
  restingTranslateX: number,
  hiddenTranslateX: number
): EntryExitAnimationFunction {
  return () => {
    "worklet";
    return {
      initialValues: {
        opacity: 0.5,
        transform: [{ translateX: hiddenTranslateX }],
      },
      animations: {
        opacity: withDelay(100, withSpring(1, indicatorSpring)),
        transform: [
          {
            translateX: withDelay(100, withSpring(restingTranslateX, indicatorSpring)),
          },
        ],
      },
    };
  };
}

function createIndicatorExiting(
  restingTranslateX: number,
  hiddenTranslateX: number
): EntryExitAnimationFunction {
  return () => {
    "worklet";
    return {
      initialValues: {
        opacity: 1,
        transform: [{ translateX: restingTranslateX }],
      },
      animations: {
        opacity: withDelay(500, withSpring(0.5, indicatorSpring)),
        transform: [
          {
            translateX: withDelay(500, withSpring(hiddenTranslateX, indicatorSpring)),
          },
        ],
      },
    };
  };
}

/**.
 * Currently this single component encapsulates the drag indicator.
 * It is used in the MoveableItem.tsx.
 * The Problem is that it forces a single drag indicator across whole project
 * even though you can move it to come in from left or right, it would be nice to
 * give more control to change for each scroll.
 * NOTE: The DragIndicator is the wrapper animation and inside of it is the actual visual.
 * The DragIndicator is simply a view that moves in and out of the screen.  It does have some
 * styling on it too...  Maybe just let the style for this be passed through???
 */
const DefaultDragIndicator: React.FC<DragIndicatorProps> = ({
  itemHeight,
  fromLeftOrRight = "right",
  currentPosition,
  totalItems,
  config,
}) => {
  const direction = fromLeftOrRight === "left" ? -1 : 1;
  const {
    translateXDistance,
    indicatorBackgroundColor,
    indicatorBorderWidth,
    indicatorBorderColor,
    indicatorBorderRadius,
  } = { ...defaultDragConfig, ...config };
  const hiddenTranslateX = 100 * direction;
  const restingTranslateX = translateXDistance * direction * -1;

  return (
    <Animated.View
      entering={createIndicatorEntering(restingTranslateX, hiddenTranslateX)}
      exiting={createIndicatorExiting(restingTranslateX, hiddenTranslateX)}
      style={{
        position: "absolute",
        [fromLeftOrRight]: 0,
        backgroundColor: indicatorBackgroundColor ? indicatorBackgroundColor : "#eee",
        justifyContent: "center",
        borderWidth: indicatorBorderWidth,
        borderColor: indicatorBorderColor,
        marginTop: (itemHeight - itemHeight / 1.5) / 2,
        height: itemHeight / 1.5,
        borderRadius: indicatorBorderRadius,
      }}
    >
      <DragIndicatorDisplay currentPosition={currentPosition} totalItems={totalItems} />
    </Animated.View>
  );
};

export default DefaultDragIndicator;

const DragIndicatorDisplay: React.FC<{
  currentPosition: number;
  totalItems: number;
}> = ({ currentPosition, totalItems }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingRight: 10,
        paddingLeft: 20,
      }}
    >
      <Animated.View
        key={currentPosition}
        entering={positionScaleEntering}
      >
        <Text style={{ color: "green", paddingRight: 3 }}>{currentPosition}</Text>
      </Animated.View>
      <Text> of {totalItems} </Text>
    </View>
  );
};
