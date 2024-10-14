import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { MovieDetails, useMovieData, useMovieDetailData } from "@/store/dataHooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AddIcon, DeleteIcon } from "@/components/common/Icons";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { MotiView, useDynamicAnimation } from "moti";

import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  LinearTransition,
  ReduceMotion,
  SequencedTransition,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import MotiDetailImage from "./MotiDetailImage";
import AnimatedLinearGradient from "./AnimatedLinearGradient";
import MDImageDescRow from "./MDImageDescRow";
import MDDetails from "./MDDetails";

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  useDynamicAnimation();
  const [movieAdding, setMovieAdding] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const movieActions = useMovieActions();
  const { storedMovie } = useMovieStore((state) => ({
    storedMovie: state.actions.getShowById(movieId),
  }));
  const existsInSaved = !!storedMovie?.id;
  const { movieDetails, isLoading } = useMovieDetailData(movieId);

  //-- HEADER RIGHT ----------

  const handleAddMovie = useCallback(() => {
    if (!movieDetails) return;
    setMovieAdding(true);

    const movieToAdd = {
      id: movieDetails.id,
      title: movieDetails.title,
      overview: movieDetails.overview,
      releaseDate: movieDetails.releaseDate,
      posterURL: movieDetails.posterURL,
      backdropURL: movieDetails.backdropURL,
      genres: movieDetails.genres,
      videos: movieDetails.videos,
    } as movieSearchByTitle_Results;

    movieActions.addShow(movieToAdd);
    setMovieAdding(false);
  }, [movieId, isLoading]);

  let HeaderRight = () => (
    <TouchableOpacity
      className="pr-2 mr-[-10] pl-1"
      activeOpacity={0.5}
      onPress={() => handleAddMovie()}
      disabled={movieAdding}
    >
      <AddIcon />
    </TouchableOpacity>
  );
  if (storedMovie) {
    HeaderRight = () => (
      <TouchableOpacity
        className="pr-2 mr-[-10] pl-1"
        activeOpacity={0.5}
        onPress={async () => {
          const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");
          if (yesDelete) {
            movieActions.removeShow(storedMovie.id);
            router.back();
          }
        }}
      >
        <DeleteIcon />
      </TouchableOpacity>
    );
  }
  //-- HEADER RIGHT END ---------
  // React.useEffect(() => {
  //   setStoredMovie(movieActions.getShowById(movieId));
  // }, [movieId]);

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: storedMovie?.title || movieDetails?.title || "",
      headerRight: HeaderRight,
      headerBackTitle: "Back",
    };
    navigation.setOptions(options);
  }, [movieId, isLoading, storedMovie]);

  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  const backgroundStartColor = storedMovie?.posterColors?.background?.color || "#000000";
  const backgroundEndColor = storedMovie?.posterColors?.lightestColor || "#FFFFFF";

  return (
    <View className="flex-1 ">
      <LinearGradient
        colors={[backgroundStartColor, backgroundEndColor]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
      />
      <View className="flex-1 flex-col" style={{ marginTop: headerHeight + 5 }}>
        <View className="px-2">
          <MDImageDescRow
            movieDetails={movieDetails as MovieDetails}
            existsInSaved={existsInSaved}
          />
        </View>

        <View className="pt-1">
          <MDDetails movieDetails={movieDetails as MovieDetails} existsInSaved={existsInSaved} />
        </View>
      </View>
    </View>
  );
};

export default MovieDetailsContainer;
