import { ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { useMovieActions, useTags } from "@/store/store.shows";
import TagCloudEnhanced, { TagItem } from "@/components/common/TagCloud/TagCloudEnhanced";

type Props = {
  movieId: number;
  savedTagIds: string[];
  handleChangePending: (changeState: boolean) => void;
};
const ActionBarTags = ({ movieId, savedTagIds, handleChangePending }: Props) => {
  const movieActions = useMovieActions();
  const tags = useTags();
  const savedKey = savedTagIds.join("\0");
  const [draftTagIds, setDraftTagIds] = useState<string[] | null>(null);
  const [draftBaseKey, setDraftBaseKey] = useState(savedKey);
  const selectedIdsRef = useRef(savedTagIds);

  if (draftBaseKey !== savedKey) {
    setDraftBaseKey(savedKey);
    setDraftTagIds(null);
  }

  const selectedIds = draftBaseKey === savedKey ? (draftTagIds ?? savedTagIds) : savedTagIds;
  selectedIdsRef.current = selectedIds;
  const tagList = tags.map((tag) => ({
    ...tag,
    applied: selectedIds.includes(tag.id),
  }));

  // The TagCloudEnhanced component expects "include", "off" or "exclude" as the states in onToggleTag
  // When the list is rendered, it calls this function and based on the active flag choose "include" or "off"
  // This informs the async function that is returned what the state of the tag was when the TagItem was renderedd
  // Based on this info, the function know whether to add or remove the tag from the movie.
  const handleToggleTag = (currState: "include" | "off") => async (tagId: string) => {
    if (!movieId) return;
    handleChangePending(true);
    const current = selectedIdsRef.current;
    const next =
      currState === "include"
        ? current.filter((id) => id !== tagId)
        : Array.from(new Set([...current, tagId]));
    selectedIdsRef.current = next;
    setDraftTagIds(next);
    movieActions.setPendingChanges(movieId, { tags: next });
  };

  return (
    <ScrollView
      className="border-border border-t-hairline w-full"
      contentContainerClassName="pb-10"
    >
      <TagCloudEnhanced>
        {tagList.map((el) => (
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
