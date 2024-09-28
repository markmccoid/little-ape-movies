import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import { FetchNextPageFn } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import SearchResult from "@/components/search/SearchResult";
import useMovieStore from "@/store/store.shows";
import { SymbolView } from "expo-symbols";
import useSettingsStore from "@/store/store.settings";

type Props = {
  movies: MovieSearchResults[];
  fetchNextPage: FetchNextPageFn<MovieSearchResults[]> | undefined;
};
const SearchContainer = ({ movies, fetchNextPage }: Props) => {
  // const { isLoading } = useSearchResults();
  // const { movies, isLoading, fetchNextPage } = useTitleSearch();
  const numColumns = useSettingsStore((state) => state.searchColumns);
  // const [numColumns, toggleNumColumns] = useReducer((state) => (state === 2 ? 3 : 2), 3);
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

  return (
    <View className="flex-1">
      {/* <TouchableOpacity onPress={() => toggleNumColumns()} className="absolute z-10">
        {numColumns === 3 ? (
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
      </TouchableOpacity> */}

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
        onEndReachedThreshold={0.5}
        keyboardDismissMode="on-drag" // Dismiss keyboard when scrolling starts
        keyboardShouldPersistTaps="handled" // Prevent keyboard from persisting when tapping on items
      />
    </View>
  );
};

export default SearchContainer;
