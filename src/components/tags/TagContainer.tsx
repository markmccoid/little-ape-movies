import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Alert, Pressable, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import useMovieStore, { Tag, useMovieActions } from "@/store/store.shows";

import { PlusCircle } from "@/lib/icons/PlusCircle";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import TagItem from "./TagItem";
import DragDropEntry, { TScrollFunctions } from "@/components/common/DragAndSort/DragDropEntry";
import DragItem from "@/components/common/DragAndSort/DragItem";
import { sortArray } from "@/components/common/DragAndSort/helperFunctions";

const HeaderRight = () => {
  const actions = useMovieActions();

  const handleNewTagPrompt = () => {
    Alert.prompt(
      "Enter New Tag",
      "If it is not unique, it won't be added",
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
              console.log("NAME", name);
              try {
                actions.tagAdd(name);
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
      "",
      "default"
    );
  };

  return (
    <Pressable onPress={handleNewTagPrompt}>
      <PlusCircle />
    </Pressable>
  );
};

export default function TagContainer() {
  const tags = useMovieStore((state) => state.tagArray);
  const navigation = useNavigation();
  const actions = useMovieActions();

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      headerRight: () => <HeaderRight />,
    };
    navigation.setOptions(options);
  }, []);

  const renderItem = useCallback((info: DragListRenderItemInfo<Tag>) => {
    const { item, onDragStart, onDragEnd, isActive, index } = info;
    const handleDragStart = () => {
      console.log("draggin");
      onDragStart();
    };

    return (
      <TouchableOpacity
        onPressIn={handleDragStart}
        onPressOut={onDragEnd}
        style={{ backgroundColor: isActive ? "blue" : "red" }}
      >
        <TagItem tag={item} isActive={isActive} />
        {/* <Text>HI</Text> */}
      </TouchableOpacity>
    );
  }, []);

  const updateItemList = (sortArray: Tag[]) => {
    // console.log("Updating Items List");
    actions.tagUpdateOrder(sortArray);
  };

  return (
    <View className="flex-1">
      <DragDropEntry
        scrollStyles={{ width: "100%", height: "30%", borderWidth: 1, borderColor: "#aaa" }}
        updatePositions={(positions) => updateItemList(sortArray<Tag>(positions, tags, "pos"))}
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={50}
        handlePosition="left"
        // handle={AltHandle} // This is optional.  leave out if you want the default handle
        enableDragIndicator={true}
      >
        {tags.map((item, idx) => {
          return (
            <TagItem
              key={item.id}
              tag={item}
              id={item.id}
              // onRemoveItem={() => removeItemById(item.id)}
              // firstItem={idx === 0 ? true : false}
            />
            // <DragItem
            //   key={item.id}
            //   name={item.name}
            //   id={item.id}
            //   // onRemoveItem={() => removeItemById(item.id)}
            //   firstItem={idx === 0 ? true : false}
            // />
          );
        })}
      </DragDropEntry>
    </View>
  );
}
