import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useMovieRecommendations } from "@/store/dataHooks";
import SearchResult from "@/components/search/SearchResult";
import useMovieStore from "@/store/store.shows";

type Props = {
  movieId: number | undefined;
};
const MDMovieRecommendations = ({ movieId }: Props) => {
  if (!movieId) return null;

  const { data, isLoading } = useMovieRecommendations(movieId);
  const movieActions = useMovieStore((state) => state.actions);
  if (isLoading) return null;
  return (
    <ScrollView horizontal>
      {data &&
        data.map((el) => {
          return (
            <SearchResult
              movie={el}
              numColumns={3}
              key={el.id}
              spacing={{ bottomMargin: 1, extraHeight: 2 }}
              onAddMovie={movieActions.addShow}
              onRemoveMovie={movieActions.removeShow}
            />
          );
        })}
    </ScrollView>
  );
};

export default MDMovieRecommendations;
