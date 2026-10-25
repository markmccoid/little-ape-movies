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
import {
  useFocusEffect,
  useGlobalSearchParams,
  useIsFocused,
  useLocalSearchParams,
  useNavigation,
  useRouter,
  type NativeStackNavigationOptions,
} from "expo-router";
import { SearchBarCommands } from "react-native-screens";
import { debounce } from "lodash";
import { SearchType, useSearchStore } from "@/store/store.search";
import PersonSearchContainer from "@/components/search/personSearch/PersonSearchContainer";
import MovieSearchContainer from "@/components/search/movieTitleSearch/MovieSearchContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import SearchInput from "@/components/search/SearchInput";
import SearchInputAccessoryView from "@/components/search/SearchInputAccessoryView";

import { GripHorizontalIcon } from "@/components/common/Icons";
import NestedStackDrawerToggle from "@/components/common/NestedStackDrawerToggle";
import { useMovieDetailData } from "@/store/dataHooks";
import { useAuth } from "@/providers/AuthProvider";

const firstParam = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
};

const SearchPage = () => {
  const { colors } = useCustomTheme();
  const searchColumns = useSettingsStore((state) => state.searchColumns);
  const columnRotation = useSharedValue(searchColumns === 2 ? 0 : 90);
  const settingsActions = useSettingsStore((state) => state.actions);
  const { setSearch, setSearchType } = useSearchStore((state) => state.actions);
  const searchType = useSearchStore((state) => state.searchType);
  const searchValue = useSearchStore((state) => state.searchVal);
  const { top } = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const params = useLocalSearchParams<{
    deeplinkShowId?: string | string[];
    deeplinkTitle?: string | string[];
  }>();
  const deeplinkShowId = firstParam(params.deeplinkShowId);
  const deeplinkTitle = firstParam(params.deeplinkTitle);
  const showIdNumber = Number(deeplinkShowId);
  const shouldLookupTitle =
    Boolean(deeplinkShowId) && !deeplinkTitle && Number.isInteger(showIdNumber) && showIdNumber > 0;
  const { movieDetails, isError, isLoading } = useMovieDetailData(shouldLookupTitle ? showIdNumber : 0);
  const openedShowId = useRef<string | null>(null);
  // Startup hydration publishes CLEAR_SEARCH_STORES, which wipes a title set
  // during the cold-start deep link. Wait until that reset has finished.
  const { initialized: storesHydrated } = useAuth();

  useEffect(() => {
    columnRotation.value = withSpring(searchColumns === 2 ? 90 : 0, {
      damping: 10,
      mass: 1,
      stiffness: 100,
    });
  }, [searchColumns]);

  const columnToggleStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${columnRotation.value}deg` }],
  }));

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
      if (!searchValue && !deeplinkShowId) {
        inputRef.current?.focus();
      }
    }, [deeplinkShowId, searchValue])
  );

  useEffect(() => {
    if (!storesHydrated) return;
    if (!deeplinkShowId) {
      openedShowId.current = null;
      return;
    }
    if (openedShowId.current === deeplinkShowId) return;
    const title = deeplinkTitle || movieDetails?.title;
    if (!title && !(shouldLookupTitle && isError && !isLoading)) return;

    openedShowId.current = deeplinkShowId;
    if (title) {
      setSearchType("title");
      setSearch(title);
    }
    const showId = deeplinkShowId;
    setTimeout(() => {
      router.setParams({ deeplinkShowId: "", deeplinkTitle: "" });
      router.push({
        pathname: "/search/[showId]",
        params: { showId },
      });
    }, 0);
  }, [
    storesHydrated,
    deeplinkShowId,
    deeplinkTitle,
    isError,
    isLoading,
    movieDetails?.title,
    router,
    setSearch,
    setSearchType,
    shouldLookupTitle,
  ]);

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
            <Animated.View style={columnToggleStyle}>
              <GripHorizontalIcon color={colors.primary} />
            </Animated.View>
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
