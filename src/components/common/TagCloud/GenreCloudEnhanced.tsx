import React from "react";
import { View, Text, LayoutAnimation, TouchableOpacity, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { UnTagIcon } from "../Icons";
import { SymbolView } from "expo-symbols";

type Props = {
  tagId: string;
  state: "off" | "include" | "exclude";
  onToggleTag: (tagId: string) => void;
  onLongPress?: (tagId: string) => void;
  tagName: string;
  size: string;
};

export const GenreItem = ({
  tagId,
  state,
  onToggleTag,
  onLongPress,
  tagName,
  size = "s",
}: Props) => {
  const { colors } = useCustomTheme();
  const bgColor = state === "include" ? "green" : state === "exclude" ? colors.deleteRed : "white";
  const fgColor = state === "exclude" ? "white" : "black";
  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(tagId) : undefined}
      activeOpacity={0.8}
      className="border border-border py-[1] px-[7] m-[5] text-center"
      style={{ backgroundColor: bgColor, borderRadius: 10 }}
      key={tagId}
      onPress={() => onToggleTag(tagId)}
      //isSelected={isSelected} //used in styled components
    >
      <View className="flex-row items-center">
        <SymbolView
          name={state === "exclude" ? "theatermasks.fill" : "theatermasks"}
          size={size === "s" ? 22 : 30}
          tintColor={state === "exclude" ? "white" : "black"}
        />
        <Text className="pl-1" style={{ fontSize: 12, color: fgColor }}>
          {tagName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TagCloudEnhanced = ({ children }) => {
  return <View className="flex-row flex-wrap justify-center">{children}</View>;
};

export default TagCloudEnhanced;

/*
Usage Example:
  <TagCloudEnhanced>
        {mergedTags.map((tag) => (
          <TagItemEnhanced
            key={tag.id}
            tagId={tag.id}
            tagName={tag.name}
            size="s"
            state={tag.state}
            onToggleTag={handleTagSelect(tag.state)}
            onLongPress={handleLongPress(tag.state)}
          />
        ))}
  </TagCloudEnhanced>
--------
  The state can be "off", "include" or "exclude"
  If you are just doing on/off style, the just map to "off" and "include"
*/
