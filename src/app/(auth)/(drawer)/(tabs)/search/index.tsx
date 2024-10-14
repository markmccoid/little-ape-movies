import {
  View,
  Pressable,
  TextInput,
  InputAccessoryView,
  Text,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { SearchBarCommands } from "react-native-screens";
import { debounce } from "lodash";
import { SearchType, useSearchStore } from "@/store/store.search";
import PersonSearchContainer from "@/components/search/personSearch/PersonSearchContainer";
import MovieSearchContainer from "@/components/search/movieTitleSearch/MovieSearchContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiText, MotiView } from "moti";
import { useCustomTheme } from "@/utils/colorThemes";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import SearchInput from "@/components/search/SearchInput";
import SearchInputAccessoryView from "@/components/search/SearchInputAccessoryView";

const SearchPage = () => {
  const { colors } = useCustomTheme();
  const searchColumns = useSettingsStore((state) => state.searchColumns);
  const settingsActions = useSettingsStore((state) => state.actions);
  const { setSearch, setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);
  const { top } = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  // Setup react navigation search bar in header
  const debouncedSetSearchText = useCallback(
    debounce((searchValue) => {
      setSearch(searchValue);
    }, 500),
    []
  );

  React.useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: false,
    };
    navigation.setOptions(options);
  }, []);

  // const handleSearchType = (type: SearchType) => {
  //   inputRef.current?.focus();
  //   setSearchType(type);
  // };

  const routeFocused = useIsFocused();
  useEffect(() => {
    if (routeFocused) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  return (
    <View className="flex-1">
      <View className="bg-card border-b-hairline border-border" style={{ paddingTop: top }}>
        <View className="flex-row w-full items-center" style={{ marginTop: 10 }}>
          <View className="mr-2 mb-2 flex-1" style={{ marginLeft: 18 }}>
            <SearchInput
              onChange={debouncedSetSearchText}
              setIsFocused={setIsFocused}
              ref={inputRef}
            />
          </View>
          {/* Toggle from 3 to 2 or 2 to 3 columns being shown */}
          <Pressable
            onPress={settingsActions.toggleSearchColumns}
            className="flex-row items-center h-full pr-4 pl-2"
          >
            <MotiView
              from={{ transform: [{ rotateZ: searchColumns === 2 ? "180deg" : "0deg" }] }}
              animate={{ transform: [{ rotateZ: searchColumns === 2 ? "0deg" : "180deg" }] }}
            >
              <SymbolView
                name="arrow.left.and.right.text.vertical"
                // name="rectangle.expand.vertical"
                style={{
                  width: 25,
                  height: 25,
                }}
                colors={searchColumns === 2 ? [colors.primary, "green"] : ["green", colors.primary]}
                type="palette"
              />
            </MotiView>
          </Pressable>
        </View>
        {/* <View className="flex-row gap-3 items-center" style={{ marginLeft: 20 }}>
          <Pressable
            onPress={() => {
              handleSearchType("title");
            }}
            className={`p-2`}
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
          <Pressable onPress={() => handleSearchType("person")} className={`p-2`}>
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
        </View> */}
        <SearchInputAccessoryView />
      </View>

      {/* Spacer for when searchType field is shown */}
      {/* {isSearchEmpty && !hideTypeSelect && <View style={{ height: viewHeight }} />} */}
      {searchType === "title" && <MovieSearchContainer />}
      {searchType === "person" && <PersonSearchContainer />}
    </View>
  );
};

export default SearchPage;
