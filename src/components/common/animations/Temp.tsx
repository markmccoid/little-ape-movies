import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  LinearTransition,
  ZoomOut,
} from "react-native-reanimated";
import TagCloud, { TagItem } from "../TagCloud/TagCloud";
import { TagIcon } from "../Icons";
import useMovieStore, { useMovieActions } from "@/store/store.shows";

const LIST_ITEM_COLOR = "#1798DE";

interface Item {
  id: number;
}

// [
// {id: 0},
// {id: 1},
// ...,
// {id: 9}
// ]

export default function App() {
  const initialMode = useRef<boolean>(true);
  const mactions = useMovieActions();

  const shows = useMovieStore((state) => state.shows);
  const sampleId = shows[0].id;
  const sampleTitle = shows[0].title;
  const sampleTags = shows[0].tags;
  console.log(sampleId, sampleTitle, sampleTags);
  useEffect(() => {
    initialMode.current = false;
  }, []);

  // new Array(5).fill(0).map((_, index) => ({ id: index }))
  const [items, setItems] = useState<Item[]>(
    new Array(5).fill(0).map((_, index) => ({ id: index }))
  );

  const onAdd = useCallback(() => {
    setItems((currentItems) => {
      const nextItemId = (currentItems[currentItems.length - 1]?.id ?? 0) + 1;
      return [...currentItems, { id: nextItemId }];
    });
  }, []);

  const onDelete = useCallback((itemId: number) => {
    setItems((currentItems) => {
      return currentItems.filter((item) => item.id !== itemId);
    });
  }, []);

  const onSelect = (tagId: string) => {
    console.log("TagID Selected", tagId);
    mactions.updateShowTags(sampleId, tagId, "add");
  };
  const onDeselect = (tagId: string) => {
    console.log("TagID Deselected", tagId);
    mactions.updateShowTags(sampleId, tagId, "remove");
  };
  return (
    <View className=" border">
      <View className=" h-[200] border">
        <TagCloud>
          <TagItem
            size="s"
            onSelectTag={onSelect}
            onDeSelectTag={onDeselect}
            isSelected={true}
            tagId="1"
            tagName="Mark"
            key={1}
          />
          <TagItem
            size="s"
            onSelectTag={onSelect}
            onDeSelectTag={onDeselect}
            isSelected={false}
            tagId="2"
            tagName="Lori"
            key={2}
          />
          <TagItem
            size="s"
            onSelectTag={onSelect}
            onDeSelectTag={onDeselect}
            isSelected={false}
            tagId="3"
            tagName="Hunter"
            key={3}
          />
          <TagItem
            size="s"
            onSelectTag={onSelect}
            onDeSelectTag={onDeselect}
            isSelected={false}
            tagId="4"
            tagName="Haley"
            key={4}
          />
        </TagCloud>
      </View>
      {/* <TouchableOpacity style={styles.floatingButton} onPress={onAdd}>
        <Text style={{ color: "white", fontSize: 40 }}>+</Text>
      </TouchableOpacity>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 50 }}>
        {items.map((item, index) => {
          return (
            <Animated.View
              key={item.id}
              entering={initialMode.current ? FadeIn.delay(100 * index) : FadeIn}
              exiting={ZoomOut}
              layout={LinearTransition.delay(1000)}
              onTouchEnd={() => onDelete(item.id)}
              style={styles.listItem}
            />
          );
        })}
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    height: 100,
    backgroundColor: LIST_ITEM_COLOR,
    width: "90%",
    marginVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    // Shadow on Android
    elevation: 5,
    // Shadow on iOS
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  floatingButton: {
    width: 80,
    aspectRatio: 1,
    backgroundColor: "black",
    borderRadius: 40,
    position: "absolute",
    bottom: 50,
    right: "5%",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
