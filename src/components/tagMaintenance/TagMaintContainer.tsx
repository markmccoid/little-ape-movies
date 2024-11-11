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
import TagMaintItem from "./TagMaintItem";
import DragDropEntry, { TScrollFunctions } from "@/components/common/DragAndSort/DragDropEntry";
import DragItem from "@/components/common/DragAndSort/DragItem";
import { sortArray } from "@/components/common/DragAndSort/helperFunctions";
import { DragHandleIcon, GripHorizontalIcon } from "../common/Icons";
import { GripHorizontal } from "@/lib/icons/GripHorizontals";

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

export default function TagMaintContainer() {
  const tags = useMovieStore((state) => state.tagArray);
  const navigation = useNavigation();
  const actions = useMovieActions();
  const [localTags, setLocalTags] = useState<Tag[]>();

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      headerRight: () => <HeaderRight />,
    };
    navigation.setOptions(options);
  }, []);

  const updateItemList = (sortedArray: Tag[] | undefined) => {
    if (!sortedArray || sortedArray.length === 0) return [];
    actions.tagUpdateOrder(sortedArray);
  };

  return (
    <View className="flex-1">
      <DragDropEntry
        scrollStyles={{ width: "100%", height: "30%", borderWidth: 1, borderColor: "#aaa" }}
        updatePositions={(positions) =>
          updateItemList(sortArray<Tag>(positions, tags, { positionField: "pos" }))
        }
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={40}
        handlePosition="left"
        handle={MyHandle} // This is optional.  leave out if you want the default handle
        enableDragIndicator={true}
      >
        {tags.map((item, idx) => {
          return (
            <TagMaintItem
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

const MyHandle: React.FC = () => (
  <View
    style={{
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      className="bg-card"
      style={{
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 10,
        marginLeft: 4,
        marginVertical: 4,
        height: 32,
        // backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
      }}
    >
      {/* <DragHandleIcon size={25} col /> */}
      <GripHorizontal className="text-card-foreground" />
    </View>
  </View>
);
