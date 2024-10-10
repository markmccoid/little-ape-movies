import React, { useEffect } from "react";
import { ViewStyle, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  useDerivedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedLinearGradientProps = {
  colors: string[];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

const ReanimatedLinearGradient: React.FC<AnimatedLinearGradientProps> = ({
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}) => {
  const progress = useSharedValue(0);
  const fromColors = useSharedValue(colors);
  const toColors = useSharedValue(colors);

  useEffect(() => {
    fromColors.value = toColors.value;
    toColors.value = colors;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 300 });
  }, [colors]);

  const animatedColors = useDerivedValue(() => {
    return [
      interpolateColor(progress.value, [0, 1], [fromColors.value[0], toColors.value[0]]),
      interpolateColor(
        progress.value,
        [0, 1],
        [fromColors.value[1] || fromColors.value[0], toColors.value[1] || toColors.value[0]]
      ),
    ];
  });

  const animatedProps = useAnimatedProps(() => ({
    colors: animatedColors.value,
  }));

  return (
    <AnimatedLinearGradient
      style={[StyleSheet.absoluteFillObject, style]}
      start={start}
      end={end}
      animatedProps={animatedProps}
    />
  );
};

export default ReanimatedLinearGradient;
