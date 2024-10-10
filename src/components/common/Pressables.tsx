import React, { useCallback } from "react";
import { Pressable as RNPressable, PressableProps, StyleProp, ViewStyle } from "react-native";

interface CustomPressableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

export const PressableOpacity: React.FC<CustomPressableProps> = ({
  children,
  style,
  activeOpacity = 0.2,
  ...otherProps
}) => {
  // Define a style callback that adjusts opacity based on the pressed state
  const _style = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      {
        backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
      },
      style,
    ],
    [style, activeOpacity]
  );

  return (
    <RNPressable
      style={({ pressed }: { pressed: boolean }) => [
        {
          backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </RNPressable>
  );
};
