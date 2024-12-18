import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import useMovieStore, {
  updateTagState,
  useGetAppliedTags,
  useMovieActions,
} from "@/store/store.shows";
import TagCloudEnhanced, { TagItem } from "@/components/common/TagCloud/TagCloudEnhanced";

type Props = {
  movieId: number;
};
const ActionBarTags = ({ movieId }: Props) => {
  const actions = useMovieActions();
  const tags = useMovieStore((state) => state.tagArray);
  const appliedTags = useGetAppliedTags(movieId);
  const movieTags = updateTagState(tags, appliedTags?.map((el) => el.id) || []);

  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!movieId) return;
    if (currState === "include") {
      actions.updateShowTags(movieId, tagId, "remove");
    } else {
      actions.updateShowTags(movieId, tagId, "add");
    }
  };

  return (
    <ScrollView className="border-border border-t-hairline" contentContainerClassName="pb-10">
      <TagCloudEnhanced>
        {movieTags?.map((el) => (
          <TagItem
            size="xs"
            onToggleTag={handleToggleTag(el.applied ? "include" : "off")}
            state={el.applied ? "include" : "off"}
            tagId={el?.id}
            tagName={el?.name}
            key={el?.id}
            type="boolean"
          />
        ))}
      </TagCloudEnhanced>
    </ScrollView>
  );
};

export default ActionBarTags;
