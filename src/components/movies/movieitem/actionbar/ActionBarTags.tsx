import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect } from "react";
import useMovieStore, {
  TagState,
  updateTagState,
  useGetAppliedTags,
  useMovieActions,
} from "@/store/store.shows";
import TagCloudEnhanced, { TagItem } from "@/components/common/TagCloud/TagCloudEnhanced";
import { set } from "lodash";

type Props = {
  movieId: number;
  handleChangePending: (changeState: boolean) => void;
};
const ActionBarTags = ({ movieId, handleChangePending }: Props) => {
  const movieActions = useMovieActions();
  const tags = useMovieStore((state) => state.tagArray);
  const appliedTags = useGetAppliedTags(movieId) || [];
  // returns an array of tags with an applied property
  const [newTagList, setNewTagList] = React.useState<TagState[] | []>([]);
  const [newAppliedTags, setNewAppliedTags] = React.useState<string[]>([]);
  //!! UNDERSTAND THIS BETTER
  useEffect(() => {
    if (appliedTags) {
      setNewAppliedTags(appliedTags?.map((el) => el.id) || []);
    }
  }, []);

  useEffect(() => {
    const updatedTagList = tags.map((tag) => ({
      ...tag,
      applied: newAppliedTags.includes(tag.id),
    }));
    setNewTagList(updatedTagList);
  }, [newAppliedTags]);

  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!movieId) return;
    handleChangePending(true);
    if (currState === "include") {
      movieActions.setPendingChanges(movieId, {
        tags: newAppliedTags.filter((el) => el !== tagId),
      });
      setNewAppliedTags((prev) => prev.filter((el) => el !== tagId));
      // actions.updateShowTags(movieId, tagId, "remove");
    } else {
      movieActions.setPendingChanges(movieId, { tags: [...newAppliedTags, tagId] });
      setNewAppliedTags((prev) => Array.from(new Set([...prev, tagId])));
      // actions.updateShowTags(movieId, tagId, "add");
    }
  };

  return (
    <ScrollView className="border-border border-t-hairline" contentContainerClassName="pb-10">
      <TagCloudEnhanced>
        {newTagList?.map((el) => (
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
