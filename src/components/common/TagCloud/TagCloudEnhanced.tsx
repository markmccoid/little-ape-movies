import React, { useReducer, useState } from "react";
import { View, Text, LayoutAnimation, TouchableOpacity, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { UnTagIcon } from "../Icons";

type Props = {
  tagId: string;
  state: "off" | "include" | "exclude";
  onToggleTag: (tagId: string) => Promise<void>;
  onLongPress?: (tagId: string) => void;
  tagName: string;
  size: string;
  type: "boolean" | "threestate";
};
const cycleState = (state: Props["state"], type: Props["type"]): Props["state"] => {
  switch (state) {
    case "include":
      if (type === "boolean") {
        return "off";
      }
      return "exclude";
    case "exclude":
      return "off";
    case "off":
      return "include";
    default:
      return "off";
  }
};
export const TagItem = ({
  tagId,
  state,
  onToggleTag,
  onLongPress,
  tagName,
  size = "s",
  type = "threestate",
}: Props) => {
  const { colors } = useCustomTheme();
  const [localState, setLocalState] = useState(state);
  const bgColor =
    localState === "include" ? "green" : localState === "exclude" ? colors.deleteRed : "white";
  const fgColor = localState === "exclude" ? "white" : "black";

  // Using localState so updates are optimistic
  React.useEffect(() => {
    setLocalState(state);
  }, [state]);

  const handleStateChange = async (tagId: string) => {
    const prevState = localState;
    setLocalState(cycleState(localState, type));
    try {
      await onToggleTag(tagId);
    } catch (error) {
      console.log("Error setting Genre Tag");
      setLocalState(prevState);
    }
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(tagId) : undefined}
      activeOpacity={0.8}
      className="border border-border py-[5] px-[7] m-[5] text-center"
      style={{ backgroundColor: bgColor, borderRadius: 10 }}
      key={tagId}
      onPress={() => handleStateChange(tagId)}
      // onPress={() => onToggleTag(tagId)}
      //isSelected={isSelected} //used in styled components
    >
      <View className="flex-row items-center">
        {state === "exclude" ? (
          <UnTagIcon size={size === "s" ? 15 : 20} color="white" style={{ paddingRight: 8 }} />
        ) : (
          <AntDesign
            style={{ paddingRight: 5 }}
            name={localState !== "off" ? "tag" : "tago"}
            size={size === "s" ? 15 : 20}
          />
        )}
        <Text className="" style={{ color: fgColor }}>
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
