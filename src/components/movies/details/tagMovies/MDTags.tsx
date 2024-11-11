import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useMovieStore, {
  MovieStore,
  ShowItemType,
  Tag,
  updateTagState,
  useMovieActions,
} from "@/store/store.shows";
import TagCloud, { TagItem } from "@/components/common/TagCloud/TagCloud";
import TagCloudEnhanced, {
  TagItem as TagItemEnhanced,
} from "@/components/common/TagCloud/TagCloudEnhanced";

type Props = {
  existsInSaved: boolean;
  storedMovie: ShowItemType | undefined;
};
const MDTags = ({ storedMovie, existsInSaved }: Props) => {
  const actions = useMovieActions();
  const tags = useMovieStore((state) => state.tagArray);
  const appliedTags = storedMovie?.tags;
  const movieTags = updateTagState(tags, appliedTags || []);

  //type DetailTags = (typeof movieTags)[number]
  // const [localTags, setLocalTags] = useState<DetailTags[]>(movieTags)

  const handleToggleTag = (currState: "include" | "off") => (tagId: string) => {
    if (!storedMovie?.id) return;
    if (currState === "include") {
      actions.updateShowTags(storedMovie?.id, tagId, "remove");
    } else {
      actions.updateShowTags(storedMovie?.id, tagId, "add");
    }
  };

  return (
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
          />
        ))}
      </TagCloudEnhanced>
    </View>
  );
};

export default MDTags;
