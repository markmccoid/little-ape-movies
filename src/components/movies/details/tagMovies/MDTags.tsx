import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import useMovieStore, {
  MovieStore,
  ShowItemType,
  Tag,
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

  // Track maximum height between the two views
  const onLayout = (event) => {
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
      {!showAddTag && (
        <MotiView className="flex-row" key={1} from={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                    <MotiView
                      className="flex-row justify-center items-center px-[5] py-[2] mr-[5] mb-[4]"
                      style={{
                        backgroundColor: colors.colorSelected,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: 8,
                      }}
                      key={tagObj.id}
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "timing", delay: index * 100 }}
                    >
                      {/* <Pressable key={tagObj.tagId} onPress={() => setViewTags((prev) => !prev)}> */}
                      <Text>{tagObj.name}</Text>
                      {/* </Pressable> */}
                    </MotiView>
                  );
                })}
              <Text style={{ width: 10 }}></Text>
            </Pressable>
          </ScrollView>
        </MotiView>
      )}
      {showAddTag && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 150 }}
          exit={{ opacity: 0, height: 0 }}
          key={2}
        >
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
        </MotiView>
      )}
    </View>
  );
};

export default MDTags;
