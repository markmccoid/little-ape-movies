import { View, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";
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
import { EditIcon } from "@/components/common/Icons";
import Animated, { BounceIn, BounceOut, LinearTransition } from "react-native-reanimated";

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
  const [containerHeight, setContainerHeight] = useState(150);
  const [isMeasured, setIsMeasured] = useState(false);

  // Measure the size of the "Edit" Tags
  // This is done on a view that is set to opacity zero and abosolute positioning
  // the isMeasured flag lets us HIDE this view once measures AND
  // only show the actual view when the measuring is done.
  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setContainerHeight(height);
    setIsMeasured(true);
  };

  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!storedMovie?.id) return;
    if (currState === "include") {
      actions.updateShowTags(storedMovie?.id, tagId, "remove");
    } else {
      actions.updateShowTags(storedMovie?.id, tagId, "add");
    }
  };

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
      )}
      {/* END */}

      <MotiView
        className="flex-row items-center justify-center"
        key={1}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Pressable onPress={toggleAddTag} className="">
          <Animated.View
            className="p-1 mr-1 border-hairline bg-secondary rounded-lg flex-row items-center"
            layout={LinearTransition}
          >
            <EditIcon size={20} color={colors.secondaryForeground} />
            {appliedTags?.length === 0 && (
              <Text className="ml-5 mr-3 text-secondary-foreground">Add Tags</Text>
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
            <MotiView
              className={`flex-row justify-center items-center px-[5] py-[2] mr-[5] ${
                showAddTag ? "opacity-55" : "opacity-100"
              }`}
              style={{
                backgroundColor: colors.colorSelected,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 8,
              }}
              key={item.id}
              // from={{ opacity: 0, scale: 0.5 }}
              // animate={{ opacity: 1, scale: 1 }}
              // transition={{ type: "timing", delay: index * 100 }}
              entering={BounceIn}
              exiting={BounceOut}
            >
              <Text>{item.name}</Text>
            </MotiView>
          )}
          itemLayoutAnimation={LinearTransition}
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, height: showAddTag ? 0 : containerHeight }}
        animate={{ opacity: 1, height: showAddTag ? containerHeight : 0 }}
        // exit={{ opacity: 0, height: 0 }}
        key={2}
      >
        {showAddTag && isMeasured && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          </MotiView>
        )}
      </MotiView>
    </View>
  );
};

export default MDTags;
