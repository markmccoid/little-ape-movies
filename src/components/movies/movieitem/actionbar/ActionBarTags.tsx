import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import useMovieStore, {
  Tag,
  TagState,
  updateTagState,
  useGetAppliedTags,
  useMovieActions,
} from "@/store/store.shows";
import TagCloudEnhanced, { TagItem } from "@/components/common/TagCloud/TagCloudEnhanced";

type Props = {
  movieId: number;
  handleChangePending: (changeState: boolean) => void;
};
const ActionBarTags = ({ movieId, handleChangePending }: Props) => {
  const movieActions = useMovieActions();
  const tags = useMovieStore((state) => state.tagArray);
  // const movies = useMovieStore((state) => state.shows);
  const appliedTags = useGetAppliedTags(movieId) || [];
  const prevAppliedTagsRef = useRef<Pick<Tag, "id" | "name">[] | undefined>(undefined);
  // returns an array of tags with an applied property
  const [newTagList, setNewTagList] = React.useState<TagState[] | []>([]);
  const [newAppliedTags, setNewAppliedTags] = React.useState<string[]>([]);

  // Runs when appliedTags or tags change -> these are the values in the Store (truth)
  // This keeps us up to date when a new Tag is added OR when a tag is added in the detail screen.
  useEffect(() => {
    const prevTags = prevAppliedTagsRef.current;
    const newTags = appliedTags;

    if (!prevTags) {
      prevAppliedTagsRef.current = newTags;
      const mergeAppliedTags = [...new Set([...newTags.map((el: any) => el.id)])];
      const updatedTagList = tags.map((tag) => ({
        ...tag,
        applied: mergeAppliedTags.includes(tag.id),
      }));

      setNewTagList(updatedTagList);
      setNewAppliedTags(mergeAppliedTags);
      return;
    }

    if (newTags.length !== prevTags.length) {
      prevAppliedTagsRef.current = newTags;
      const mergeAppliedTags = [...new Set([...newTags.map((el: any) => el.id)])];
      const updatedTagList = tags.map((tag) => ({
        ...tag,
        applied: mergeAppliedTags.includes(tag.id),
      }));

      setNewTagList(updatedTagList);
      setNewAppliedTags(mergeAppliedTags);
      return;
    }

    const hasChanges = newTags.some((tag: any, index: number) => tag !== prevTags[index]);

    if (hasChanges) {
      prevAppliedTagsRef.current = newTags;
      const mergeAppliedTags = [...new Set([...newTags.map((el: any) => el.id)])];
      const updatedTagList = tags.map((tag) => ({
        ...tag,
        applied: mergeAppliedTags.includes(tag.id),
      }));

      setNewTagList(updatedTagList);
      setNewAppliedTags(mergeAppliedTags);
    }
    // console.log("in Tags");
    // const prevTags = prevTagsRef.current;
    // const newTags = appliedTags;

    // const mergeAppliedTags = [...new Set([...appliedTags.map((el) => el.id)])];
    // const updatedTagList = tags.map((tag) => ({
    //   ...tag,
    //   applied: mergeAppliedTags.includes(tag.id),
    // }));

    // setNewTagList(updatedTagList);
    // setNewAppliedTags(mergeAppliedTags);
  }, [tags, appliedTags]);

  // The TagCloudEnhanced component expects "include", "off" or "exclude" as the states in onToggleTag
  // When the list is rendered, it calls this function and based on the active flag choose "include" or "off"
  // This informs the async function that is returned what the state of the tag was when the TagItem was renderedd
  // Based on this info, the function know whether to add or remove the tag from the movie.
  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!movieId) return;
    handleChangePending(true);
    if (currState === "include") {
      movieActions.setPendingChanges(movieId, {
        tags: newAppliedTags.filter((el) => el !== tagId),
      });
      console.log("EXCLUDE TAG", newAppliedTags);
      setNewAppliedTags((prev) => prev.filter((el) => el !== tagId));
    } else {
      movieActions.setPendingChanges(movieId, { tags: [...newAppliedTags, tagId] });
      setNewAppliedTags((prev) => Array.from(new Set([...prev, tagId])));
    }
  };

  return (
    <ScrollView
      className="border-border border-t-hairline w-full"
      contentContainerClassName="pb-10"
    >
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
