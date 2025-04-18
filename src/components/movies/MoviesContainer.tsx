import React, { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ShowItemType, useMovies } from "@/store/store.shows";
import MovieItem from "./movieitem/MovieItem";
import MovieAnimatedView from "./movieitem/MovieAnimatedView";

import { getMovieItemSizing } from "./movieitem/movieItemHelpers";
import { useFocusEffect, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import MovieSearch from "./MovieSearch";
import useSettingsStore, { FilterStatus } from "@/store/store.settings";
import { useSearchStore } from "@/store/store.search";
import { SymbolView } from "expo-symbols";
import { useCustomTheme } from "@/lib/colorThemes";
import { match, P } from "ts-pattern";
import { FilterIcon } from "../common/Icons";

const MoviesContainer = () => {
  // get the itemHeight for building our getItemLayout
  // If you want to change the layout, ONLY do it in th egetMovieItemSizing function
  const router = useRouter();
  const titleSearchValue = useSettingsStore((state) => state.titleSearchValue);
  const getFilterStatus = useSettingsStore((state) => state.actions.getFilterStatus);
  const { setSearch } = useSearchStore((state) => state.actions);
  const { horizontalMargin, itemHeight } = getMovieItemSizing();
  const { filteredMovies: movies } = useMovies();
  const { colors } = useCustomTheme();
  const flatListRef = React.useRef<FlatList>(null);
  const [hideAll, setHideAll] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollY = useSharedValue(0);
  const animHeight = useSharedValue(0);
  const searchY = useSharedValue(-40);
  // Use to determine message to show when no movies are found
  const filterStatus = getFilterStatus();
  const [noMoviesText, setNoMoviesText] = useState<{ text: string; action: "filter" | "search" }>({
    text: "",
    action: "search",
  });
  //!! Effect used to determine what text to display when no movies are found
  //!! In Process - using ts-pattern to determine what text to display when no movies are found
  //!!
  //!!
  useEffect(() => {
    /**
     * checking for
     *  "No movies match your filters/change filter?"  movieCount === 0 & filterStatus === active & titleSearchValue: P.union(undefined, ""),
     *  "No movies in library, Search and Add a Movie" movieCount === 0 & filterStatus === inactive & searchOpen === false
     *  "No movies found in library Search" movieCount === 0 & filterStatus === inactive & searchOpen === true
     */
    const filterTest: {
      searchOpen: boolean;
      filterStatus: FilterStatus;
      titleSearchValue: string | undefined;
      movieCount: number;
    } = {
      searchOpen,
      filterStatus,
      titleSearchValue,
      movieCount: movies.length,
    };
    // Using ts-pattern to determine what text to display when no movies are found
    const matchTest = match(filterTest)
      .with(
        {
          movieCount: 0,
          filterStatus: { overallStatus: "active" },
          titleSearchValue: P.union(undefined, ""),
        },
        () => ({ text: "No movies match your filters", action: "filter" })
      )
      .with(
        {
          movieCount: 0,
          filterStatus: { overallStatus: "inactive" },
          searchOpen: false,
        },
        () => ({ text: "No movies in library, Search and Add a Movie", action: "search" })
      )
      .with(
        {
          movieCount: 0,
          searchOpen: true,
        },
        () => ({
          text: "Movie not found in your library",
          action: "search",
        })
      )
      .with({ filterStatus: { overallStatus: "inactive" } }, () => ({
        text: "Active Inactive",
        action: "search",
      }))
      .otherwise(() => `Other no match`) as { text: string; action: "filter" | "search" };
    //Set the state
    setNoMoviesText(matchTest);
  }, [movies.length, titleSearchValue]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      animHeight.value = event.contentOffset.y * -1;

      if (event.contentOffset.y < -30) {
        runOnJS(setSearchOpen)(true);
        // searchY.value = withTiming(3);
        // return;
      } else if (event.contentOffset.y > 25 && titleSearchValue?.length === 0) {
        runOnJS(setSearchOpen)(false);
        searchY.value = withTiming(-40);
        return;
      }

      searchY.value = searchOpen ? withTiming(3) : -40 + animHeight.value;
    },
  });

  const handleSetVisible = (opening: boolean) => {
    setSearchOpen(opening);
    if (!opening) {
      searchY.value = withTiming(-40);
    } else {
      searchY.value = withTiming(0);
    }
  };
  const getItemLayout = (data: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => setHideAll(false), 0);
      return () => {
        setTimeout(() => setHideAll(true), 0);
      };
    }, [])
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ShowItemType; index: number }) => {
      const column = (index % 2) as 0 | 1;
      return (
        <MovieAnimatedView index={index} scrollY={scrollY}>
          <Animated.View entering={FadeIn.duration(500)}>
            <MovieItem movie={item} hideAll={hideAll} column={column} />
          </Animated.View>
        </MovieAnimatedView>
      );
    },
    [hideAll, movies]
  );

  const hStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchY.value }],
    };
  });
  const listStyle = useAnimatedStyle(() => {
    // console.log("Flatlist PAdding", searchY.value);
    return {
      paddingTop: searchY.value + 40,
    };
  });

  return (
    <View className="flex-1 z-10">
      <Animated.View style={[hStyle]} className="w-full absolute z-20">
        <MovieSearch isVisible={searchOpen} handleSetVisible={handleSetVisible} searchY={searchY} />
      </Animated.View>

      {movies.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Pressable
            onPress={() => {
              if (noMoviesText.action === "search") {
                router.push("/(auth)/(drawer)/(tabs)/search");
                setSearch(titleSearchValue);
                return;
              }
              // send to filter route
              router.push("/(auth)/(drawer)/(tabs)/home/filtermodal");
            }}
            className="justify-center items-center"
          >
            <Text className="text-xl font-semibold mb-2">{noMoviesText.text}</Text>
            <View className="flex-row border border-border items-center px-2 py-1 rounded-lg bg-secondary">
              {noMoviesText.action === "search" ? (
                <View className="p-2 flex-row items-center">
                  <SymbolView name="popcorn" size={50} tintColor={colors.primary} />
                  <Text className="text-xl font-semibold ml-3">Search?</Text>
                </View>
              ) : (
                <View className="p-2 flex-row items-center">
                  <FilterIcon color={colors.primary} size={50} />
                  <Text className="text-xl font-semibold ml-3">Change Filter?</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      )}
      <Animated.FlatList
        data={movies}
        ref={flatListRef}
        renderItem={renderItem}
        // extraData={hideActionBar}
        // keyExtractor={(item, index) => index.toString()}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={[listStyle, { zIndex: 10 }]}
        columnWrapperStyle={{ marginHorizontal: horizontalMargin }}
        onScroll={scrollHandler}
        getItemLayout={getItemLayout}
        keyboardDismissMode="on-drag"
      />
      {/* <MovieSearch isVisible={showSearch} handleSetVisible={handleSetVisible} scrollY={scrollY} /> */}
    </View>
  );
};

export default React.memo(MoviesContainer);
