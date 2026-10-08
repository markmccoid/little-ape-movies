import {
  View,
  Text,
  InputAccessoryView,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SearchType, useSearchStore } from "@/store/store.search";

const SearchInputAccessoryView = () => {
  const [titleWidth, setTitleWidth] = useState(0);
  const [personWidth, setPersonWidth] = useState(0);
  const { setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);
  const highlightLeft = useSharedValue(0);
  const highlightWidth = useSharedValue(35);
  const titleOpacity = useSharedValue(searchType === "title" ? 1 : 0.5);
  const personOpacity = useSharedValue(searchType === "person" ? 1 : 0.5);

  useEffect(() => {
    const spring = { damping: 10, mass: 1, stiffness: 100 };
    highlightLeft.value = withSpring(searchType === "title" ? 20 : 20 + titleWidth, spring);
    highlightWidth.value = withSpring(searchType === "title" ? titleWidth : personWidth, spring);
    titleOpacity.value = withTiming(searchType === "title" ? 1 : 0.5, { duration: 300 });
    personOpacity.value = withTiming(searchType === "person" ? 1 : 0.5, { duration: 300 });
  }, [searchType, titleWidth, personWidth]);

  const highlightStyle = useAnimatedStyle(() => ({
    left: highlightLeft.value,
    width: highlightWidth.value,
  }));
  const titleLabelStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));
  const personLabelStyle = useAnimatedStyle(() => ({
    opacity: personOpacity.value,
  }));

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
          <Animated.View
            className="absolute top-[3] h-[25] rounded-lg bg-yellow-200"
            style={[highlightStyle, { borderWidth: StyleSheet.hairlineWidth }]}
          />
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
            <Animated.Text style={titleLabelStyle} className="text-text">
              Title
            </Animated.Text>
          </Pressable>
          <Pressable
            onPress={() => handleSearchType("person")}
            className={`py-2 px-[10]`}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setPersonWidth(width);
            }}
          >
            <Animated.Text style={personLabelStyle} className="text-text">
              Person
            </Animated.Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    </KeyboardAvoidingView>
  );
};

export default SearchInputAccessoryView;
