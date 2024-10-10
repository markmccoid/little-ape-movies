import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import MovieImage from "@/components/common/MovieImage";
import { useMovieData, useMovieDetailData } from "@/store/dataHooks";
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
    <View className="flex-1">
      <LinearGradient
        colors={[backgroundStartColor, backgroundEndColor]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
      />
      <View className="flex-1 flex-col" style={{ marginTop: headerHeight }}>
        <View
          className="border"
          style={{
            flexDirection: "row",
            justifyContent: existsInSaved ? "flex-start" : "flex-end",
          }}
        >
          {/* {existsInSaved ? ( */}
          <View className="flex-row flex-1 mx-1">
            <Animated.View
              sharedTransitionTag="detailImage"
              key={1}
              layout={SequencedTransition.duration(1000).reverse().reduceMotion(ReduceMotion.Never)}
              exiting={FadeOut.duration(1000)}
              entering={FadeIn.duration(1000)}
            >
              <MotiDetailImage existsInSaved={existsInSaved} posterURL={movieDetails?.posterURL} />
            </Animated.View>
            <Animated.View
              className="flex-1 ml-2"
              key={2}
              layout={SequencedTransition.duration(1000).reverse().reduceMotion(ReduceMotion.Never)}
              exiting={FadeOut.duration(1000)}
              entering={FadeIn.duration(1000)}
            >
              <Overview overview={movieDetails?.overview} />
            </Animated.View>
          </View>
        </View>
        <Text className="text-text">MovieId {movieDetails?.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Overview = ({ overview }: { overview: string | undefined }) => {
  return (
    <ScrollView>
      <Animated.Text entering={FadeInRight.duration(1000)}>{overview}</Animated.Text>
    </ScrollView>
    // <View className="border border-red-600">
    //   <Text lineBreakMode="tail" numberOfLines={5}>
    //     {overview}
    //   </Text>
    // </View>
  );
};

export default MovieDetailsContainer;
