import { View, Text } from "react-native";
import React from "react";
import useMovieStore, { Tag } from "@/store/store.shows";

import TagCloudEnhanced, {
  TagItem as TagItemEnhanced,
} from "@/components/common/TagCloud/TagCloudEnhanced";

export type TagState = {
  id: string;
  name: string;
  state: "off" | "include" | "exclude";
};

// Sets up the state of the tags.  If editing a filter, it will merge the tags with the filter's tags
// otherwise it will just set the tags to "off"
const mergeTags = (tags: Tag[], initTags: TagState[]): TagState[] => {
  return tags.map((tag) => {
    const initTag = initTags.find((t) => t.id === tag.id);
    if (initTag) {
      return initTag;
    }
    return { id: tag.id, name: tag.name, state: "off" };
  });
};

type Props = {
  handleTagList: (tagIdIn: string, action: "include" | "exclude" | "off") => void;
  initTags: TagState[];
};
// Component that displays the tags in a cloud format
const SavedFilterTags = ({ handleTagList, initTags }: Props) => {
  const tags = useMovieStore((state) => state.tagArray);
  const [tagState, setTagState] = React.useState<TagState[]>(mergeTags(tags, initTags));

  // Update the tagState when the initTags change
  React.useEffect(() => {
    setTagState(mergeTags(tags, initTags));
  }, [initTags]);

  const handleTagSelect = (tagState: TagState["state"]) => async (tagId: string) => {
    // include -> exclude -> off
    if (tagState === "include") {
      setTagState((prev) =>
        prev.map((tag) => (tag.id === tagId ? { ...tag, state: "exclude" } : tag))
      );
      // Add to Exclude tag list and remove from Include tag list
      handleTagList(tagId, "exclude");
      return;
    }
    if (tagState === "exclude") {
      setTagState((prev) => prev.map((tag) => (tag.id === tagId ? { ...tag, state: "off" } : tag)));
      // Add to Exclude tag list and remove from Include tag list
      handleTagList(tagId, "off");
      return;
    }
    if (tagState === "off") {
      setTagState((prev) =>
        prev.map((tag) => (tag.id === tagId ? { ...tag, state: "include" } : tag))
      );
      handleTagList(tagId, "include");
      return;
    }
  };

  const handleLongPress = (tagState: TagState["state"]) => (tagId: string) => {
    // off -> exclude
    if (tagState === "off") {
      setTagState((prev) =>
        prev.map((tag) => (tag.id === tagId ? { ...tag, state: "exclude" } : tag))
      );
      handleTagList(tagId, "exclude");
      return;
    }
    // exclude -> off, include -> off
    setTagState((prev) => prev.map((tag) => (tag.id === tagId ? { ...tag, state: "off" } : tag)));
    handleTagList(tagId, "off");
  };
  return (
    <View>
      <TagCloudEnhanced>
        {tagState.map((tag) => (
          <TagItemEnhanced
            key={tag.id}
            tagId={tag.id}
            tagName={tag.name}
            size="s"
            state={tag.state}
            onToggleTag={handleTagSelect(tag.state)}
            onLongPress={handleLongPress(tag.state)}
            type="threestate"
          />
        ))}
      </TagCloudEnhanced>
    </View>
  );
};

export default SavedFilterTags;
