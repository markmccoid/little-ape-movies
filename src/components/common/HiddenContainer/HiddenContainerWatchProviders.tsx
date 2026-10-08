import React, { ReactNode, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, Pressable, ViewStyle, ScrollView } from "react-native";
import { ExpandDownIcon, CollapseUpIcon } from "@/components/common/Icons";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useMovieWatchProviders } from "@/store/dataHooks";
import { useCustomTheme } from "@/lib/colorThemes";

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
  height: number;
  style?: ViewStyle;
  startOpen?: boolean;
  movieId: number;
};

const HiddenContainerWatchProviders: React.FC<Props> = ({
  children,
  movieId,
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
  const { watchProviders } = useMovieWatchProviders(movieId);
  const { colors } = useCustomTheme();
  const streamProviders = watchProviders.find((el) => el.type === "stream");

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
    panelHeight.value = withTiming(open ? height : 0, { duration: 500 }, (finished) => {
      if (finished && !openSv.value) {
        runOnJS(unmountContent)();
      }
    });
    if (open) {
      setContentMounted(true);
      contentOpacity.value = withTiming(1, { duration: 300 });
    } else {
      contentOpacity.value = withTiming(0, { duration: 300 });
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
    >
      <View className="flex-row items-center w-full ">
        <View className="flex-row justify-start flex-1">
          <Pressable
            style={({ pressed }) => [
              {
                // flex: 1,
                // borderBottomColor: "#777",
                // borderBottomWidth: 1,
                // backgroundColor: "#ffffff77",
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            className="py-2 flex-1"
            onPress={() => setViewContents((prev) => !prev)}
          >
            <View className="pl-4">
              <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: 15 }}>{title}</Text>
            </View>
          </Pressable>
        </View>
        {streamProviders?.providers && streamProviders?.providers.length > 0 && (
          <View style={{ maxWidth: 140 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 8,
              }}
              contentContainerStyle={{
                paddingVertical: 5,
                paddingHorizontal: 5,
                backgroundColor: colors.card,
              }}
            >
              {streamProviders?.providers &&
                streamProviders?.providers.map((el) => (
                  <View key={el.providerId} style={{ marginHorizontal: 3 }}>
                    {el?.logoURL && (
                      <Image
                        source={{ uri: el.logoURL }}
                        style={{ width: 25, height: 25, borderRadius: 4 }}
                      />
                    )}
                  </View>
                ))}
            </ScrollView>
          </View>
        )}
        {/* <View className="flex-row justify-end flex-1"> */}
        <Pressable
          style={({ pressed }) => [
            {
              height: "100%",
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          className="py-2 pl-4"
          onPress={() => setViewContents((prev) => !prev)}
        >
          <View className="pr-4">
            <Animated.View style={chevronStyle}>
              <ExpandDownIcon size={20} />
            </Animated.View>
          </View>
        </Pressable>
        {/* </View> */}
      </View>

      <Animated.View style={panelHeightStyle}>
        {contentMounted && <Animated.View style={contentStyle}>{children}</Animated.View>}
      </Animated.View>
    </View>
  );
};

export default HiddenContainerWatchProviders;

const styles = StyleSheet.create({});
