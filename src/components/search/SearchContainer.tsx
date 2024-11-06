import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { FetchNextPageFn } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import SearchResult from "@/components/search/SearchResult";
import useMovieStore from "@/store/store.shows";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import { MotiView } from "moti";
import useImageSize from "@/hooks/useImageSize";
import { useFocusEffect } from "expo-router";

type Props = {
  movies: MovieSearchResults[];
  fetchNextPage: FetchNextPageFn<MovieSearchResults[]> | undefined;
};

//-- Used in SearchResult and in getItemLayout --
// Bottom Margin
const BOTTOM_MARGIN = 10;
// extra height for the bottom "button" to select/unselect movie
const EXTRA_HEIGHT = 20;

const SearchContainer = ({ movies, fetchNextPage }: Props) => {
  const numColumns = useSettingsStore((state) => state.searchColumns);
  const { imageHeight, imageWidth } = useImageSize(numColumns);
  const movieActions = useMovieStore((state) => state.actions);
  const fetchNextPageFunc = fetchNextPage ? fetchNextPage : () => {};
  const flatListRef = useRef<FlatList>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  //! - - - -- - - -- - - -- - - -- - - -
  //! This useFocusEffect is used in conjunction with the isMovieLoading state
  //!  that is passed to MovieItem.
  //!  When a MovieItem is pressed, it sets the state and all other items won't allow a press
  //!  useFocusEffect resets the state.  This seems to be an issue with how slowly the navigation transitions.
  //! - - - -- - - -- - - -- - - -- - - -
  useFocusEffect(
    useCallback(() => {
      setIsMovieLoading(false);
    }, [])
  );

  const renderItem = ({ item, index }: { item: MovieSearchResults; index: number }) => {
    return (
      <SearchResult
        movie={item}
        isMovieLoading={isMovieLoading}
        setIsMovieLoading={setIsMovieLoading}
        onAddMovie={movieActions.addShow}
        onRemoveMovie={movieActions.removeShow}
        numColumns={numColumns}
        spacing={{ bottomMargin: BOTTOM_MARGIN, extraHeight: EXTRA_HEIGHT }}
      />
    );
  };

  const getItemLayout = (_, index: number) => ({
    length: imageHeight + BOTTOM_MARGIN + EXTRA_HEIGHT, // Item height plus in SearchResult there is A bottom margin and extra height added to imageHeight
    offset: (imageHeight + BOTTOM_MARGIN + EXTRA_HEIGHT) * index, // Offset for the current index
    index,
  });

  return (
    <View className="flex-1">
      <FlatList
        data={movies}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={({ distanceFromEnd }) => {
          fetchNextPageFunc();
        }}
        // onEndReached={setNextPage}
        onEndReachedThreshold={0.7}
        keyboardDismissMode="on-drag" // Dismiss keyboard when scrolling starts
        keyboardShouldPersistTaps="handled" // Prevent keyboard from persisting when tapping on items
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default SearchContainer;
