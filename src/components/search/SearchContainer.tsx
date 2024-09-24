import { View, Text, Image, FlatList } from "react-native";
import React, { useCallback } from "react";
import { FetchNextPageFn } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import SearchResult from "@/components/search/SearchResult";
import useMovieStore from "@/store/store.shows";

type Props = {
  movies: MovieSearchResults[];
  fetchNextPage: FetchNextPageFn<MovieSearchResults[]> | undefined;
};
const SearchContainer = ({ movies, fetchNextPage }: Props) => {
  // const { isLoading } = useSearchResults();
  // const { movies, isLoading, fetchNextPage } = useTitleSearch();

  const movieActions = useMovieStore((state) => state.actions);
  const fetchNextPageFunc = fetchNextPage ? fetchNextPage : () => {};

  const renderItem = ({ item, index }: { item: MovieSearchResults; index: number }) => {
    return (
      <SearchResult
        movie={item}
        onAddMovie={movieActions.addShow}
        onRemoveMovie={movieActions.removeShow}
      />
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
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
