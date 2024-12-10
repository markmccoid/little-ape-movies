import {
  Image,
  View,
  ScrollView,
  useColorScheme,
  Text,
  Pressable,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Link, useRouter, useNavigation } from "expo-router";
import { MovieDetails, useMovieDetailData, useOMDBData } from "@/store/dataHooks";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import useMovieStore, { useMovieActions } from "@/store/store.shows";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import MDImageDescRow from "./MDImageDescRow";
import MDDetails from "./MDDetails";
import MDRatings from "./MDRatings";
import { eventBus } from "@/store/eventBus";
import MDDeleteButton from "./MDButtonDelete";
import MDButtonAdd from "./MDButtonAdd";
import MDTagsAnim from "./tagMovies/MDTagsAnim";
import HiddenContainers from "./MovieDetailsHiddenContainers";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const movieActions = useMovieActions();
  const movies = useMovieStore((state) => state.shows);
  // const { storedMovie } = useMovieStore((state) => ({
  //   storedMovie: state.actions.getShowById,
  // });
  const storedMovie = movieActions.getShowById(movieId);
  const existsInSaved = !!storedMovie?.existsInSaved;
  const { movieDetails, isLoading } = useMovieDetailData(movieId);
  const { data: omdbData, isLoading: omdbLoading } = useOMDBData(movieDetails?.imdbId);

  const [finalMovieDetails, setFinalMovieDetails] = useState<MovieDetails>(movieDetails);
  //!! We need have local state so that we only update component AFTER
  //!! it has received focus (see isFocused page)
  const [movieTitle, setMovieTitle] = useState<string>(movieDetails?.title || "");
  //!!

  const isFocused = navigation.isFocused();
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFinalMovieDetails(movieDetails);
    }
  }, [isLoading]);
  // determines when the "where to watch" and below items load.
  useEffect(() => {
    requestAnimationFrame(() => {
      setShouldRender(true);
    });
  }, []);

  // console.log("stored", storedMovie, existsInSaved, movieDetails);
  //-- HEADER RIGHT ----------
  const handleAddMovie = useCallback(async () => {
    if (!movieDetails) return;
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

    await movieActions.addShow(movieToAdd);
  }, [finalMovieDetails]);

  //~~ --------------------------------
  //~~ Setup Header Right Components
  const HeaderRight = () => (
    <MDDeleteButton movieId={storedMovie?.id} removeShow={movieActions.removeShow} />
  );
  const HeaderRightAdd = () => {
    return <MDButtonAdd addShow={handleAddMovie} />;
  };
  //~~ --------------------------------

  // Sets the title and Header icons
  // needs to update
  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      // title: movieTitle || "", //storedMovie?.title || movieDetails?.title || "",
      headerRight: existsInSaved ? HeaderRight : HeaderRightAdd,
    };
    navigation.setOptions(options);
  }, [movieId, existsInSaved, movieTitle, isLoading, colorScheme]);

  // Once we are focused and not loading, update the local state
  // Local state will be used to update the component
  useEffect(() => {
    if (isFocused && !isLoading) {
      setMovieTitle(storedMovie?.title || movieDetails?.title || "");
    }
  }, [isFocused, isLoading]);

  //~ Update streaming providers
  useEffect(() => {
    if (existsInSaved) {
      InteractionManager.runAfterInteractions(() =>
        eventBus.publish("UPDATE_SHOW_PROVIDERS", storedMovie?.id)
      );
    }
  }, [existsInSaved]);

  return (
    <View className="flex-1">
      {existsInSaved && storedMovie?.posterURL && (
        <Image
          source={{ uri: storedMovie?.posterURL }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.2,
            resizeMode: "contain",
          }}
        />
      )}

      <ScrollView
        style={{
          paddingTop: 5,
          flexGrow: 1,
          marginBottom: tabBarHeight,
        }}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 15 }}
      >
        {/* IMAGE and DESC */}
        <View>
          <MDImageDescRow
            movieDetails={movieDetails as MovieDetails}
            storedMovie={storedMovie}
            existsInSaved={existsInSaved}
          />
        </View>

        {/* MOVIE RATINGS */}
        <View className="mt-[4] mb-[2]">
          <MDRatings movieDetails={movieDetails} omdbData={omdbData} storedMovie={storedMovie} />
        </View>
        {/* MOVIE DETAILS */}
        <View className="my-[2]">
          <MDDetails
            movieDetails={finalMovieDetails as MovieDetails}
            omdbData={omdbData}
            existsInSaved={existsInSaved}
          />
        </View>

        {existsInSaved && (
          <View key={storedMovie?.id} className="my-[2]">
            <MDTagsAnim
              // movieDetails={finalMovieDetails as MovieDetails}
              storedMovie={storedMovie}
              existsInSaved={existsInSaved}
            />
          </View>
        )}
        {/* <HiddenContainers movieId={finalMovieDetails?.id} /> */}
        {shouldRender && <HiddenContainers movieId={finalMovieDetails?.id} />}
      </ScrollView>
    </View>
  );
};

// export default MovieDetailsContainer;
export default React.memo(MovieDetailsContainer);
