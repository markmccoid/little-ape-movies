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
import useMovieStore, { ShowItemType, useMovieActions, useMovies } from "@/store/store.shows";
import MovieItem from "./movieitem/MovieItem";
import MovieAnimatedView from "./movieitem/MovieAnimatedView";

import { getMovieItemSizing } from "./movieitem/movieItemHelpers";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import MovieSearch from "./MovieSearch";
import useSettingsStore from "@/store/store.settings";
import { useSearchStore } from "@/store/store.search";
import { SymbolView } from "expo-symbols";
import { useCustomTheme } from "@/lib/colorThemes";

const MoviesContainer = () => {
  // get the itemHeight for building our getItemLayout
  // If you want to change the layout, ONLY do it in th egetMovieItemSizing function
  const router = useRouter();
  const titleSearchValue = useSettingsStore((state) => state.titleSearchValue);
  const { setSearch } = useSearchStore((state) => state.actions);
  const { horizontalMargin, itemHeight } = getMovieItemSizing();
  const movies = useMovies();
  const { colors } = useCustomTheme();
  const flatListRef = React.useRef<FlatList>(null);
  const [hideAll, setHideAll] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollY = useSharedValue(0);
  const animHeight = useSharedValue(0);
  const searchY = useSharedValue(-40);

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
              router.push("/(auth)/(drawer)/(tabs)/search");
              setSearch(titleSearchValue);
            }}
            className="justify-center items-center"
          >
            <Text className="text-xl">Movie Not Found in Your Library</Text>
            <View className="flex-row border border-border items-center px-2 py-1 rounded-lg bg-secondary">
              <Text className="text-xl font-semibold">Search?</Text>
              <SymbolView name="popcorn" size={50} tintColor={colors.primary} />
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
      />
      {/* <MovieSearch isVisible={showSearch} handleSetVisible={handleSetVisible} scrollY={scrollY} /> */}
    </View>
  );
};

export default React.memo(MoviesContainer);
