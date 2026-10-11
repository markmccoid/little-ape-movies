import { View, Text, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  ShowItemType,
  updateTagState,
  useGetAppliedTags,
  useMovieActions,
  useTags,
} from "@/store/store.shows";
import TagCloud, { TagItem } from "@/components/common/TagCloud/TagCloud";
import TagCloudEnhanced, {
  TagItem as TagItemEnhanced,
} from "@/components/common/TagCloud/TagCloudEnhanced";
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import { EditIcon } from "@/components/common/Icons";

const panelSpring = { damping: 10, mass: 1, stiffness: 100 };

function createTagEntering(delay: number) {
  return () => {
    "worklet";
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.5 }],
      },
      animations: {
        opacity: withDelay(delay, withTiming(1, { duration: 300 })),
        transform: [{ scale: withDelay(delay, withTiming(1, { duration: 300 })) }],
      },
    };
  };
}

type Props = {
  existsInSaved: boolean;
  storedMovie: ShowItemType | undefined;
};
const MDTags = ({ storedMovie, existsInSaved }: Props) => {
  const { colors } = useCustomTheme();
  const [showAddTag, toggleAddTag] = useReducer((state) => !state, false);
  const actions = useMovieActions();
  const tags = useTags();
  const appliedTags = useGetAppliedTags(storedMovie?.id);
  const movieTags = updateTagState(tags, storedMovie?.tags || []);

  const [containerHeight, setContainerHeight] = useState(0);
  const [panelMounted, setPanelMounted] = useState(false);
  const panelMountedRef = useRef(false);
  const panelHeight = useSharedValue(0);
  const panelOpacity = useSharedValue(0);

  useEffect(() => {
    if (showAddTag) {
      panelMountedRef.current = true;
      setPanelMounted(true);
      panelOpacity.value = withTiming(1, { duration: 300 });
      panelHeight.value = withSpring(150, panelSpring);
      return;
    }

    if (!panelMountedRef.current) {
      return;
    }

    const unmountPanel = () => {
      panelMountedRef.current = false;
      setPanelMounted(false);
    };

    panelOpacity.value = withTiming(0, { duration: 300 });
    panelHeight.value = withSpring(0, panelSpring, (finished) => {
      if (finished) {
        runOnJS(unmountPanel)();
      }
    });
  }, [showAddTag]);

  const panelStyle = useAnimatedStyle(() => {
    return {
      height: panelHeight.value,
      opacity: panelOpacity.value,
    };
  });

  // Track maximum height between the two views
  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setContainerHeight(height);
  };

  //type DetailTags = (typeof movieTags)[number]
  // const [localTags, setLocalTags] = useState<DetailTags[]>(movieTags)

  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!storedMovie?.id) return;
    if (currState === "include") {
      actions.updateShowTags(storedMovie?.id, tagId, "remove");
    } else {
      actions.updateShowTags(storedMovie?.id, tagId, "add");
    }
  };
  console.log("SHOW", containerHeight);
  return (
    <View className="mx-2">
      {!showAddTag && !panelMounted && (
        <Animated.View className="flex-row" entering={FadeIn.duration(300)}>
          <Pressable
            onPress={toggleAddTag}
            className="p-1 mr-1 border-hairline bg-secondary rounded-lg"
          >
            <EditIcon size={20} color={colors.secondaryForeground} />
          </Pressable>
          <ScrollView horizontal style={{}}>
            <Pressable
              style={{ flexDirection: "row" }}
              // onPress={() => setViewTags((prev) => !prev)}
            >
              {appliedTags &&
                appliedTags.map((tagObj, index) => {
                  return (
                    <Animated.View
                      className="flex-row justify-center items-center px-[5] py-[2] mr-[5] mb-[4]"
                      style={{
                        backgroundColor: colors.colorSelected,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: 8,
                      }}
                      key={tagObj.id}
                      entering={createTagEntering(index * 100)}
                    >
                      {/* <Pressable key={tagObj.tagId} onPress={() => setViewTags((prev) => !prev)}> */}
                      <Text>{tagObj.name}</Text>
                      {/* </Pressable> */}
                    </Animated.View>
                  );
                })}
              <Text style={{ width: 10 }}></Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      )}
      {(showAddTag || panelMounted) && (
        <Animated.View style={[panelStyle, { overflow: "hidden" }]}>
          <View onLayout={onLayout}>
            <Pressable
              onPress={toggleAddTag}
              className="p-1 mr-1 border-hairline bg-secondary rounded-lg"
            >
              <EditIcon size={20} color={colors.secondaryForeground} />
            </Pressable>
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
        </Animated.View>
      )}
    </View>
  );
};

export default MDTags;
