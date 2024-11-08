import { Alert, Pressable, View } from "react-native";
import React from "react";
import { Tag, useMovieActions } from "@/store/store.shows";
import { Text } from "@/components/ui/text";
import { useNavigation } from "expo-router";

type Props = {
  tag: Tag;
  isActive: boolean;
  id: string;
};
const TagItem = ({ tag, isActive, id }: Props) => {
  const navigation = useNavigation();
  const actions = useMovieActions();

  const handleEditTagPrompt = (tag: Tag) => {
    Alert.prompt(
      "Enter New Tag Value",
      "Edit Existing Tag",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (name) => {
            if (name) {
              try {
                actions.tagEdit(tag.id, name);
              } catch (e) {
                // Checking for custom error being thrown
                if (e.message.includes("duplicate")) {
                  Alert.alert("Duplicate Tag", "Tag Already Exists, nothing added");
                }
              }
            }
          },
        },
      ],
      "plain-text",
      tag.name,
      "default"
    );
  };

  return (
    <View
      className="flex-row justify-between"
      // style={{ backgroundColor: isActive ? "red" : "white" }}
    >
      <Text>{tag.name}</Text>
      <Pressable onPress={() => actions.tagRemove(tag.id)}>
        <Text>DEL</Text>
      </Pressable>
      <Pressable onPress={() => handleEditTagPrompt(tag)}>
        <Text>Edit</Text>
      </Pressable>
    </View>
  );
};

export default TagItem;
