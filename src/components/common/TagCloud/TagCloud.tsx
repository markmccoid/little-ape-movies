import React from "react";
// import PropTypes from "prop-types";
import { View, Text, LayoutAnimation, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useCustomTheme } from "@/lib/colorThemes";
// import { TagContainer, Tag, TagIcon, TagText } from "./TagCloudStyles";
type Props = {
  tagId: string;
  isSelected: boolean;
  onSelectTag: (tagId: string) => void;
  onDeSelectTag: (tagId: string) => void;
  tagName: string;
  size: string;
};
export const TagItem = ({
  tagId,
  isSelected,
  onSelectTag,
  onDeSelectTag,
  tagName,
  size = "m",
}: Props) => {
  const { colors } = useCustomTheme();
  return (
    <TouchableOpacity
      className="border border-border py-[5] px-[7] m-[5] text-center"
      style={{ backgroundColor: isSelected ? "green" : "white", borderRadius: 10 }}
      key={tagId}
      onPress={() => (isSelected ? onDeSelectTag(tagId) : onSelectTag(tagId))}
      //isSelected={isSelected} //used in styled components
    >
      <View className="flex-row items-center">
        <AntDesign
          style={{ paddingRight: 5 }}
          name={isSelected ? "tag" : "tago"}
          size={size === "s" ? 15 : 20}
        />
        <Text className="" style={{ fontSize: 12 }}>
          {tagName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TagCloud = ({ children }) => {
  return <View className="flex-row flex-wrap justify-center">{children}</View>;
};

// TagItem.propTypes = {
//   tagId: PropTypes.string,
//   isSelected: PropTypes.bool,
//   onSelectTag: PropTypes.func,
//   onDeSelectTag: PropTypes.func,
//   tagName: PropTypes.string,
//   size: PropTypes.string,
// };
export default TagCloud;

/*
Usage Example:
  <TagCloud>
    {getAllMovieTags(movie.id).map((tagObj) => {
      return (
        <TagItem
          key={tagObj.tagId}
          tagId={tagObj.tagId}
          tagName={tagObj.tagName}
          isSelected={tagObj.isSelected}
          onSelectTag={() =>
            addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
          }
          onDeSelectTag={() =>
            removeTagFromMovie({
              movieId: movie.id,
              tagId: tagObj.tagId,
            })
          }
        />
      );
    })}
  </TagCloud>
*/
