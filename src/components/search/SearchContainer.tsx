import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useSearchResults } from "@/store/query.search";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import SearchResult from "./SearchResult";
import MovieImage from "../common/MovieImage";
import useMovieStore from "@/store/store.movie";

const SearchContainer = () => {
  const { isLoading } = useSearchResults();
  const movies = useSearchStore((state) => state.results);
  const { setNextPage } = useSearchStore((state) => state.actions);
  const movieActions = useMovieStore((state) => state.actions);

  const renderItem = ({ item }: { item: MovieSearchResults }) => {
    return (
      <SearchResult
        movie={item}
        onAddMovie={movieActions.addMovie}
        onRemoveMovie={movieActions.removeMovie}
      />
    );
  };

  return (
    <View className="flex-1 mt-2">
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={setNextPage}
        onEndReachedThreshold={0.5}
        keyboardDismissMode="on-drag" // Dismiss keyboard when scrolling starts
        keyboardShouldPersistTaps="handled" // Prevent keyboard from persisting when tapping on items
      />
    </View>
  );
};

export default SearchContainer;
