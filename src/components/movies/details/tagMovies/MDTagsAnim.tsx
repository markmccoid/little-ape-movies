import { View, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { Text } from "@/components/ui/text";
import useMovieStore, {
  ShowItemType,
  updateTagState,
  useGetAppliedTags,
  useMovieActions,
} from "@/store/store.shows";
import TagCloud, { TagItem } from "@/components/common/TagCloud/TagCloud";
import TagCloudEnhanced, {
  TagItem as TagItemEnhanced,
} from "@/components/common/TagCloud/TagCloudEnhanced";
import { AnimatePresence, MotiView } from "moti";
import { useCustomTheme } from "@/lib/colorThemes";
import { EditIcon, TagIcon, TagPlusIcon } from "@/components/common/Icons";
import Animated, {
  BounceIn,
  BounceOut,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MDFavWatched from "./MDFavWatched";
import { Button } from "@/components/ui/button";

type Props = {
  existsInSaved: boolean;
  storedMovie: ShowItemType | undefined;
};
const MDTags = ({ storedMovie, existsInSaved }: Props) => {
  const { colors } = useCustomTheme();
  const [showAddTag, toggleAddTag] = useReducer((state) => !state, false);
  const actions = useMovieActions();
  const tags = useMovieStore((state) => state.tagArray);
  const appliedTags = useGetAppliedTags(storedMovie?.id);

  const movieTags = updateTagState(tags, storedMovie?.tags || []);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const toHeight = useSharedValue(0);
  // Initial Render ref so that the animation doesn't play on first load
  const initialRender = useRef(true);

  // Measure the size of the "Edit" Tags
  // This is done on a view that is set to opacity zero and abosolute positioning
  // the isMeasured flag lets us HIDE this view once measures AND
  // only show the actual view when the measuring is done.
  const onLayout = (event: LayoutChangeEvent) => {
    if (isMeasured) return;
    const height = event.nativeEvent.layout.height;
    // toHeight.value = height;
    setContainerHeight(height);
    setIsMeasured(true);
  };

  const handleToggleTag = (currState: "include" | "off") => (tagId: string) => {
    if (!storedMovie?.id) return;
    if (currState === "include") {
      actions.updateShowTags(storedMovie?.id, tagId, "remove");
    } else {
      actions.updateShowTags(storedMovie?.id, tagId, "add");
    }
  };

  const tagViewStyle = useAnimatedStyle(() => {
    if (!showAddTag) {
      toHeight.value = withTiming(0);
    } else {
      toHeight.value = withTiming(containerHeight);
    }

    return {
      height: toHeight.value,
      opacity: interpolate(toHeight.value, [containerHeight, 0], [1, 0]),
    };
  }, [isMeasured, showAddTag]);
  return (
    <View className="mx-2">
      {/* This block is to only measure the height then it is not used again */}
      {/* START */}
      {!isMeasured && (
        <View onLayout={onLayout} className="absolute opacity-0">
          <TagCloudEnhanced>
            {movieTags?.map((el) => (
              <TagItemEnhanced
                size="s"
                onToggleTag={() => {}}
                state={"off"}
                tagId={el?.id}
                tagName={el?.name}
                key={el?.id}
                type="boolean"
              />
            ))}
          </TagCloudEnhanced>
          <MDFavWatched storedMovie={storedMovie} />
        </View>
      )}
      {/* END */}

      <View className="flex-row items-center justify-center">
        {/* Add Tag Button */}
        <Pressable onPress={toggleAddTag} className="">
          <Animated.View
            className="py-1 px-3 mr-1 border-hairline bg-secondary rounded-lg flex-row items-center"
            layout={LinearTransition.duration(300)}
            style={{ width: "auto" }}
          >
            <MotiView from={{ rotate: "0deg" }} animate={{ rotate: showAddTag ? "90deg" : "0deg" }}>
              <TagPlusIcon size={25} color={colors.secondaryForeground} />
            </MotiView>
            {appliedTags?.length === 0 && !showAddTag && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: showAddTag ? 0 : 1 }}
                transition={{ type: "timing", duration: 700 }}
              >
                <Text className="ml-3 mr-2 text-secondary-foreground font-semibold text-base">
                  Add Tags
                </Text>
              </MotiView>
            )}
          </Animated.View>
        </Pressable>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={appliedTags}
          style={{ flexDirection: "row", alignContent: "center" }}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item, index }) => (
            <Pressable onPress={toggleAddTag}>
              <Animated.View
                className={`flex-row justify-center items-center px-[5] py-[2] mr-[5] 
                ${showAddTag ? "opacity-55" : "opacity-100"}`}
                style={{
                  backgroundColor: colors.colorSelected,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 8,
                }}
                key={item.id}
                entering={initialRender.current ? undefined : BounceIn.duration(100)}
                exiting={BounceOut.duration(100)}
                onLayout={() => (initialRender.current = false)}
              >
                <Text className="text-lg">{item.name}</Text>
              </Animated.View>
            </Pressable>
          )}
          itemLayoutAnimation={LinearTransition}
        />
      </View>

      <Animated.View
        style={[
          tagViewStyle,
          {
            overflow: "hidden", // Ensure contents are clipped
            // opacity: showAddTag ? 1 : 0, // Combine opacity for smooth transitions
          },
        ]}
      >
        <View>
          <TagCloudEnhanced>
            {movieTags?.map((el) => (
              <TagItemEnhanced
                size="s"
                onToggleTag={handleToggleTag(el.applied ? "include" : "off")}
                state={el.applied ? "include" : "off"}
                tagId={el?.id}
                tagName={el?.name}
                key={el?.id}
                type="boolean"
              />
            ))}
          </TagCloudEnhanced>
        </View>
        <MDFavWatched storedMovie={storedMovie} />
      </Animated.View>
    </View>
  );
};

export default MDTags;
