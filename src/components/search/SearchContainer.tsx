import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import { FetchNextPageFn } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import SearchResult from "@/components/search/SearchResult";
import useMovieStore from "@/store/store.shows";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";
import { MotiView } from "moti";
import useImageSize from "@/hooks/useImageSize";

type Props = {
  movies: MovieSearchResults[];
  fetchNextPage: FetchNextPageFn<MovieSearchResults[]> | undefined;
};
const SearchContainer = ({ movies, fetchNextPage }: Props) => {
  const numColumns = useSettingsStore((state) => state.searchColumns);
  const { imageHeight, imageWidth } = useImageSize(numColumns);
  const movieActions = useMovieStore((state) => state.actions);
  const fetchNextPageFunc = fetchNextPage ? fetchNextPage : () => {};

  const renderItem = ({ item, index }: { item: MovieSearchResults; index: number }) => {
    return (
      <SearchResult
        movie={item}
        onAddMovie={movieActions.addShow}
        onRemoveMovie={movieActions.removeShow}
        numColumns={numColumns}
      />
    );
  };

  const getItemLayout = (_, index: number) => ({
    length: imageHeight + 20 + 10, // Item height plus in SearchResult there is 10 bottom margin and extra 20 units added to imageHeight
    offset: (imageHeight + 20 + 10) * index, // Offset for the current index
    index,
  });

  return (
    <View className="flex-1">
      <FlatList
        data={movies}
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
