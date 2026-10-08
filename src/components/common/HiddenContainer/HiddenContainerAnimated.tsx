import React, { ReactNode, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable, ViewStyle } from "react-native";
import { ExpandDownIcon, CollapseUpIcon } from "@/components/common/Icons";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const CHEVRON_SPRING = { damping: 10, mass: 1, stiffness: 100 };

/**
 * Component will take a component as a child and toggle displaying or hiding
 * the content.
 * Will accept a passed "title" prop to display as title
 * Will also accept "startOpen" prop to determine if container is in
 * open state when initially displayed.
 *
 */
type Props = {
  children: ReactNode;
  title: string;
  height?: number;
  style?: ViewStyle;
  startOpen?: boolean;
};

const HiddenContainerAnimated: React.FC<Props> = ({
  children,
  style,
  title,
  height,
  startOpen = false,
}) => {
  const [viewContents, setViewContents] = useState(startOpen);
  const [isMounted, setIsMounted] = useState(false);
  const didApplyMountedState = useRef(false);
  const rotation = useSharedValue(0);
  const panelHeight = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const openSv = useSharedValue(startOpen);
  const [contentMounted, setContentMounted] = useState(startOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    const isFirstMountedPass = !didApplyMountedState.current;
    didApplyMountedState.current = true;
    const open = viewContents;
    openSv.value = open;
    if (isFirstMountedPass && !open) {
      return;
    }

    const unmountContent = () => {
      setContentMounted(false);
    };

    rotation.value = withSpring(open ? 180 : 0, CHEVRON_SPRING);
    if (typeof height === "number") {
      panelHeight.value = withTiming(open ? height : 0, { duration: 500 }, (finished) => {
        if (finished && !openSv.value) {
          runOnJS(unmountContent)();
        }
      });
    }
    if (open) {
      setContentMounted(true);
      contentOpacity.value = withTiming(1, { duration: 300 });
    } else if (typeof height === "number") {
      contentOpacity.value = withTiming(0, { duration: 300 });
    } else {
      contentOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished && !openSv.value) {
          runOnJS(unmountContent)();
        }
      });
    }
  }, [contentOpacity, height, isMounted, openSv, panelHeight, rotation, viewContents]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const panelHeightStyle = useAnimatedStyle(() => ({
    height: panelHeight.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff85",
        borderTopColor: "#777",
        borderBottomColor: "#777",
        borderBottomWidth: StyleSheet.hairlineWidth, //viewContents ? StyleSheet.hairlineWidth : StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
      className="py-2"
    >
      <Pressable
        style={({ pressed }) => [
          {
            flex: 1,
            borderBottomColor: "#777",
            borderBottomWidth: 1,
            backgroundColor: "#ffffff77",
            opacity: pressed ? 0.6 : 1,
          },
        ]}
        onPress={() => setViewContents((prev) => !prev)}
      >
        <View className="flex-row justify-between items-center">
          <View className="pl-4">
            <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: 15 }}>{title}</Text>
          </View>
          <View className="pr-4">
            <Animated.View style={chevronStyle}>
              <ExpandDownIcon size={20} />
            </Animated.View>
          </View>
        </View>
      </Pressable>

      <Animated.View style={typeof height === "number" ? panelHeightStyle : undefined}>
        {contentMounted && <Animated.View style={contentStyle}>{children}</Animated.View>}
      </Animated.View>
    </View>
  );
};

export default HiddenContainerAnimated;

const styles = StyleSheet.create({});
