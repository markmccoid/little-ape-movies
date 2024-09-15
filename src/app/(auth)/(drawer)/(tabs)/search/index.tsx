import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import React, { useCallback, useState, useRef } from "react";
import { Link, Stack, useNavigation } from "expo-router";
import { SearchBarCommands } from "react-native-screens";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import { debounce } from "lodash";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { movieSearchByTitle } from "@markmccoid/tmdb_api";
import { useSearchStore } from "@/store/store.search";
import { useSearchResults } from "@/store/query.search";
import SearchContainer from "@/components/search/SearchContainer";

const SearchPage = () => {
  const { setSearch } = useSearchStore((state) => state.actions);

  const navigation = useNavigation();
  const searchBarRef = useRef<SearchBarCommands>();
  // Setup react navigation search bar in header
  const debouncedSetSearchText = useCallback(
    debounce((searchValue) => {
      setSearch(searchValue);
    }, 300),
    []
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // title: "Search",
      // headerLeft: () => <NestedStackDrawerToggle />,
      headerSearchBarOptions: {
        autoCapitalize: "none",
        placeholder: "Search Title",
        ref: searchBarRef,
        hideNavigationBar: false,
        onChangeText: (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
          debouncedSetSearchText(event.nativeEvent.text),
      },
    });
  }, [navigation]);

  React.useEffect(() => {
    if (searchBarRef?.current) {
      searchBarRef.current.clearText();
      //setSearchBarClearFn(() => searchBarRef.current.clearText());
    }
    //return () => setSearchBarClearFn(() => {});
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <SearchContainer />
    </SafeAreaView>
  );
};

export default SearchPage;
