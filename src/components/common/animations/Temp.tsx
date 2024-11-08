import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PlusCircleIcon } from "lucide-react-native";

export default function TagContainer() {
  const mactions = useMovieActions();

  console.log("Tag tab");

  const onAddTag = () => {};

  return (
    <View className="flex-1f">
      <View className="absolute bottom-3 right-3 bg-primary rounded-full">
        <PlusCircleIcon size={50} color={"white"} />
      </View>
      <ScrollView></ScrollView>
    </View>
  );
  return (
    <View className="flex-1">
      <View className="flex-row">
        <Button
          size="sm"
          onPress={() => console.log("button from rn primatives")}
          // variant="destructive"
          variant="default"
        >
          <Text>HERE</Text>
        </Button>
      </View>
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
    </View>
  );
}
