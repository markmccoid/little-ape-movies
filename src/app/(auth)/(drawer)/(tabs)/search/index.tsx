import { View, Pressable, TextInput } from "react-native";
import React, { useCallback, useState, useRef } from "react";
import { useNavigation } from "expo-router";
import { SearchBarCommands } from "react-native-screens";
import { debounce } from "lodash";
import { useSearchStore } from "@/store/store.search";
import PersonSearchContainer from "@/components/search/personSearch/PersonSearchContainer";
import MovieSearchContainer from "@/components/search/movieTitleSearch/MovieSearchContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { MotiText, MotiView } from "moti";
import { useCustomTheme } from "@/utils/colorThemes";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import SearchInput from "@/components/search/SearchInput";

const SearchPage = () => {
  const searchColumns = useSettingsStore((state) => state.searchColumns);
  const settingsActions = useSettingsStore((state) => state.actions);
  const { colors } = useCustomTheme();
  const headerHeight = useHeaderHeight();
  const { setSearch, setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);
  const { top } = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);
  const [hideTypeSelect, setHideTypeSelect] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  // Setup react navigation search bar in header
  const debouncedSetSearchText = useCallback(
    debounce((searchValue) => {
      setSearch(searchValue);
    }, 300),
    []
  );

  React.useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: false,
    };
    navigation.setOptions(options);
  });

  const handleSearchType = (type) => {
    inputRef.current?.focus();
    setSearchType(type);
  };

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     // headerShown: true,
  //     title: "Search",
  //     headerLeft: () => <NestedStackDrawerToggle />,
  //     headerSearchBarOptions: {
  //       onFocus: () => {
  //         // navigation.setOptions({searchBarOptions: { active: true}})
  //         setHideTypeSelect(false)
  //       },
  //       onBlur: () => {
  //         navigation.setOptions({searchBarOptions: { active: false}})
  //         setHideTypeSelect(true)
  //       },
  //       autoCapitalize: "none",
  //       placeholder: "Search",
  //       ref: searchBarRef,
  //       hideNavigationBar: false,
  //       onChangeText: (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
  //         debouncedSetSearchText(event.nativeEvent.text);
  //         if (event.nativeEvent.text.length === 0) {
  //           setIsSearchEmpty(true);
  //           setHideTypeSelect(false);
  //         } else {
  //           setIsSearchEmpty(false);
  //           setHideTypeSelect(true);
  //         }
  //       },
  //     },
  //   });
  // }, [navigation]);

  // React.useEffect(() => {
  //   if (searchBarRef?.current) {
  //     searchBarRef.current.blur()
  //     // navigation.setOptions({searchBarOptions: { active: false}})
  //     setHideTypeSelect(true)
  //     // searchBarRef.current.clearText();
  //     //setSearchBarClearFn(() => searchBarRef.current.clearText());
  //   }

  // }, [searchBarRef?.current]);
  // console.log("ISFOC", isFocused);
  return (
    <View className="flex-1">
      <View className="bg-card border-b-hairline border-border" style={{ paddingTop: top }}>
        <View className="flex-row w-full items-center">
          <View className="mr-2 ml-2 flex-1 ">
            <SearchInput
              onChange={debouncedSetSearchText}
              setIsFocused={setIsFocused}
              ref={inputRef}
            />
          </View>

          <Pressable
            onPress={settingsActions.toggleSearchColumns}
            className="flex-row items-center h-full pr-4 pl-2"
          >
            {searchColumns === 2 ? (
              <SymbolView
                name="rectangle.expand.vertical"
                style={{
                  width: 25,
                  height: 25,
                  transform: [{ rotateZ: "90deg" }],
                }}
                type="hierarchical"
              />
            ) : (
              <SymbolView
                name="rectangle.compress.vertical"
                style={{ width: 25, height: 25, transform: [{ rotateZ: "90deg" }] }}
                type="hierarchical"
              />
            )}
          </Pressable>
        </View>
        <View className="flex-row gap-3 ml-4 items-center">
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
        </View>
      </View>

      {/* <MotiView
        from={{ translateY: 0 }}
        animate={{ translateY: isFocused ? 51 : -100 }}
        transition={{
          type: "timing",
          duration: 300,
        }}
        style={{
          position: "absolute",
          top: headerHeight + 50,
          width: "100%",
          // height: 40,
          backgroundColor: colors.card,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          zIndex: 1,
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}
      >
        <View className="flex-row gap-3 ml-4 items-center">
          <Pressable onPress={() => setSearchType("title")} className={`p-2`}>
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
          <Pressable onPress={() => setSearchType("person")} className={`p-2`}>
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

          <Pressable
            onPress={settingsActions.toggleSearchColumns}
            className="flex-row justify-end flex-1 mr-4 "
          >
            {searchColumns === 3 ? (
              <SymbolView
                name="rectangle.expand.vertical"
                style={{ width: 20, height: 20, transform: [{ rotateZ: "90deg" }] }}
                type="hierarchical"
              />
            ) : (
              <SymbolView
                name="rectangle.compress.vertical"
                style={{ width: 20, height: 20, transform: [{ rotateZ: "90deg" }] }}
                type="hierarchical"
              />
            )}
          </Pressable>
        </View>
      </MotiView> */}
      {/* Spacer for when searchType field is shown */}
      {/* {isSearchEmpty && !hideTypeSelect && <View style={{ height: viewHeight }} />} */}
      {searchType === "title" && <MovieSearchContainer />}
      {searchType === "person" && <PersonSearchContainer />}
    </View>
  );
};

export default SearchPage;
