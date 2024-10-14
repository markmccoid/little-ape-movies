import {
  View,
  Text,
  InputAccessoryView,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { MotiText, MotiView } from "moti";
import { SearchType, useSearchStore } from "@/store/store.search";

const SearchInputAccessoryView = () => {
  const [titleWidth, setTitleWidth] = useState(0);
  const [personWidth, setPersonWidth] = useState(0);
  const { setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);

  const handleSearchType = (type: SearchType) => {
    setSearchType(type);
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <InputAccessoryView nativeID="searchInputVID" style={{ backgroundColor: "red" }}>
        <View
          className="flex-row"
          style={{
            paddingLeft: 20,
            backgroundColor: "white",
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        >
          <MotiView
            from={{ left: 0, width: 35, borderWidth: StyleSheet.hairlineWidth }}
            animate={{
              left: searchType === "title" ? 20 : 20 + titleWidth,
              width: searchType === "title" ? titleWidth : personWidth,
            }}
            className="absolute top-[3] h-[25] rounded-lg bg-yellow-200"
          ></MotiView>
          <Pressable
            onPress={() => {
              handleSearchType("title");
            }}
            className={`py-2 px-[10]`}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setTitleWidth(width);
            }}
          >
            <MotiText
              from={{ opacity: searchType === "title" ? 0.5 : 1 }}
              animate={{ opacity: searchType === "title" ? 1 : 0.5 }}
              transition={{
                type: "timing",
                duration: 300,
              }}
              className={`text-text ${searchType === "title" ? "" : "opacity-50"}`}
            >
              Title
            </MotiText>
          </Pressable>
          <Pressable
            onPress={() => handleSearchType("person")}
            className={`py-2 px-[10]`}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setPersonWidth(width);
            }}
          >
            <MotiText
              from={{ opacity: searchType === "person" ? 0.5 : 1 }}
              animate={{ opacity: searchType === "person" ? 1 : 0.5 }}
              transition={{
                type: "timing",
                duration: 300,
              }}
              className={`text-text`}
            >
              Person
            </MotiText>
          </Pressable>
        </View>
      </InputAccessoryView>
    </KeyboardAvoidingView>
  );
};

export default SearchInputAccessoryView;
