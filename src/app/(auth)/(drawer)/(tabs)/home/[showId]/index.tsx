import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";
import { View, Text, Image, Dimensions, ScrollView } from "react-native";
import useMovieStore from "@/store/store.shows";
import { LinearGradient } from "expo-linear-gradient";
import useIsReady from "@/hooks/useIsReady";
import MDImageDescRow from "@/components/movies/details/MDImageDescRow";
import { useMovieDetailData } from "@/store/dataHooks";
import MDTagsAnim from "@/components/movies/details/tagMovies/MDTagsAnim";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const { width, height: screenHeight } = Dimensions.get("window");

const MovieDetailHome = () => {
  const { showId } = useLocalSearchParams<{ showId: string }>();
  const { storedMovie } = useMovieStore((state) => ({
    storedMovie: state.actions.getShowById(parseInt(showId)),
  }));
  const { movieDetails, isLoading } = useMovieDetailData(parseInt(showId));
  const [shouldRender, setShouldRender] = React.useState(false);
  const navigation = useNavigation();
  console.log("MOVIE ID HOME---", showId);

  useEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: storedMovie?.title || movieDetails?.title || "",
    };
    navigation.setOptions(options);
    requestAnimationFrame(() => {
      setShouldRender(true);
    });
  }, []);

  const backgroundStartColor = storedMovie?.posterColors?.primary?.color || "#000000";
  const backgroundEndColor = storedMovie?.posterColors?.darkestColor || "#FFFFFF";

  return (
    <View className="flex-1" style={{ minHeight: screenHeight }}>
      <LinearGradient
        colors={[backgroundStartColor, backgroundEndColor]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.4 }}
      />

      <View className="opacity-0 h-0">
        <MDImageDescRow
          movieDetails={movieDetails}
          storedMovie={storedMovie}
          existsInSaved={!!storedMovie?.existsInSaved}
        />
      </View>

      {shouldRender && <MovieDetailsContainer movieId={parseInt(showId, 10)} />}
    </View>
  );
};

export default MovieDetailHome;
