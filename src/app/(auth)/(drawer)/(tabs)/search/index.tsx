import {
  View,
  Pressable,
  TextInput,
  InputAccessoryView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect, useGlobalSearchParams, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { SearchBarCommands } from "react-native-screens";
import { debounce } from "lodash";
import { SearchType, useSearchStore } from "@/store/store.search";
import PersonSearchContainer from "@/components/search/personSearch/PersonSearchContainer";
import MovieSearchContainer from "@/components/search/movieTitleSearch/MovieSearchContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiText, MotiView } from "moti";
import { useCustomTheme } from "@/lib/colorThemes";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import SearchInput from "@/components/search/SearchInput";
import SearchInputAccessoryView from "@/components/search/SearchInputAccessoryView";

import { GripHorizontalIcon } from "@/components/common/Icons";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";

const SearchPage = () => {
  const { colors } = useCustomTheme();
  const searchColumns = useSettingsStore((state) => state.searchColumns);
  const settingsActions = useSettingsStore((state) => state.actions);
  const { setSearch, setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);
  const searchValue = useSearchStore((state) => state.searchVal);
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
    requestAnimationFrame(() => {
      navigation.setOptions(options);
    });
  }, []);

  // const handleSearchType = (type: SearchType) => {
  //   inputRef.current?.focus();
  //   setSearchType(type);
  // };

  useFocusEffect(
    useCallback(() => {
      // console.log("IN FOcus", searchValue);
      if (!searchValue) {
        inputRef.current?.focus();
      }
    }, [])
  );

  // const routeFocused = useIsFocused();
  // useEffect(() => {
  //   if (routeFocused) {
  //     setTimeout(() => inputRef.current?.focus(), 0);
  //   }
  // }, [routeFocused]);

  return (
    <View className="flex-1">
      <View className="bg-card border-b-hairline border-border" style={{ paddingTop: top }}>
        <View className="flex-row w-full items-center" style={{ marginTop: 10 }}>
          <View className="items-center mb-2 ml-[16] mr-[-5]">
            <NestedStackDrawerToggle />
          </View>
          <View className="mr-2 mb-2 flex-1" style={{ marginLeft: 0 }}>
            <SearchInput
              onChange={debouncedSetSearchText}
              setIsFocused={setIsFocused}
              ref={inputRef}
              initialValue={searchValue}
            />
          </View>
          {/* Toggle from 3 to 2 or 2 to 3 columns being shown */}
          <Pressable
            onPress={settingsActions.toggleSearchColumns}
            className="flex-row items-center pr-4 pl-2 h-full mb-2"
          >
            <MotiView
              from={{ transform: [{ rotateZ: searchColumns === 2 ? "0deg" : "90deg" }] }}
              animate={{ transform: [{ rotateZ: searchColumns === 2 ? "90deg" : "0deg" }] }}
            >
              <GripHorizontalIcon color={colors.primary} />
            </MotiView>
          </Pressable>
        </View>
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
