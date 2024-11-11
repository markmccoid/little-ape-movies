import { Alert, Pressable, View } from "react-native";
import React from "react";
import { Tag, useMovieActions } from "@/store/store.shows";
import { Text } from "@/components/ui/text";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCustomTheme } from "@/lib/colorThemes";

type Props = {
  tag: Tag;

  id: string;
};
const TagMaintItem = ({ tag, id }: Props) => {
  const navigation = useNavigation();
  const actions = useMovieActions();
  const { colors } = useCustomTheme();
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

  const handleTagRemove = () => {
    Alert.alert("Need to add confirmation as well as removing from existing Movies");
    actions.tagRemove(tag.id);
  };
  return (
    <View
      className="flex-row justify-between items-center h-[32] my-[4] border-hairline rounded-xl bg-card mx-1"
      // style={{ backgroundColor: isActive ? "red" : "white" }}
    >
      <View className="flex-1 pl-2">
        <Text className="font-semibold">{tag.name}</Text>
      </View>

      <View className="flex-row">
        <Pressable
          onPress={() => handleTagRemove()}
          className="px-2 py-1 mr-1 bg-destructive rounded-lg"
        >
          <SymbolView name="trash.fill" tintColor={colors.destructiveForeground} size={20} />
        </Pressable>
        <Pressable
          onPress={() => handleEditTagPrompt(tag)}
          className="p-1 mr-1 bg-primary rounded-lg"
        >
          <SymbolView name="pencil.line" tintColor={colors.secondary} size={20} />
        </Pressable>
      </View>
    </View>
  );
};

export default TagMaintItem;
