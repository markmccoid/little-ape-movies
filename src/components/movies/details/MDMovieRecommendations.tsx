import { ActivityIndicator, View, ScrollView } from "react-native";
import React from "react";
import { useMovieRecommendations } from "@/store/dataHooks";
import SearchResult from "@/components/search/SearchResult";
import { useMovieActions } from "@/store/store.shows";
import FetchNotice from "@/components/common/FetchNotice";

type Props = {
  movieId: number | undefined;
};
const MDMovieRecommendations = ({ movieId }: Props) => {
  if (!movieId) return null;

  const { data, isLoading, isError } = useMovieRecommendations(movieId);
  const movieActions = useMovieActions();
  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) return <FetchNotice message="Couldn't load recommendations." />;
  return (
    <ScrollView horizontal style={{ paddingLeft: 10, marginTop: 5 }}>
      {data &&
        data.map((el) => {
          return (
            <View key={el.id} className="mr-2">
              <SearchResult
                movie={el}
                numColumns={3}
                key={el.id}
                spacing={{ bottomMargin: 10, extraHeight: 20 }}
                onAddMovie={movieActions.addShow}
                onRemoveMovie={movieActions.removeShow}
                isMovieLoading={false}
                setIsMovieLoading={() => {}}
              />
            </View>
          );
        })}
    </ScrollView>
  );
};

export default MDMovieRecommendations;
