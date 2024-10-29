import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation, usePathname, useRouter, useSegments } from "expo-router";
import { MovieDetails, useMovieDetailData, useOMDBData } from "@/store/dataHooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AddIcon, BackIcon, DeleteIcon } from "@/components/common/Icons";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import useMovieStore, { MovieStore, ShowItemType, useMovieActions } from "@/store/store.shows";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import MDImageDescRow from "./MDImageDescRow";
import MDWatchProviders from "./watchProviders/MDWatchProviders";
import MDDetails from "./MDDetails";
import HiddenContainerAnimated from "@/components/common/HiddenContainer/HiddenContainerAnimated";
import { useCustomTheme } from "@/utils/colorThemes";
import HiddenContainerWatchProviders from "@/components/common/HiddenContainer/HiddenContainerWatchProviders";
import MDMovieRecommendations from "./MDMovieRecommendations";
import { SymbolView } from "expo-symbols";
import useImageSize from "@/hooks/useImageSize";
import MDRatings from "./MDRatings";
import MDMovieVideos from "./MDMovieVideos";
import MDMovieCast from "./cast/MDMovieCast";

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  //!! We need have local state so that we only update component AFTER
  //!! it has received focus (see isFocused page)
  const [finalMovieDetails, setFinalMovieDetails] = useState<MovieDetails>();
  const [movieTitle, setMovieTitle] = useState<string>();
  const { imageHeight } = useImageSize(3);
  //!!
  const { colors } = useCustomTheme();
  const colorScheme = useColorScheme();
  const [movieAdding, setMovieAdding] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const movieActions = useMovieActions();
  const { storedMovie } = useMovieStore((state) => ({
    storedMovie: state.actions.getShowById(movieId),
  }));
  const existsInSaved = !!storedMovie?.existsInSaved;
  const { movieDetails, isLoading } = useMovieDetailData(movieId);
  const { data: omdbData, isLoading: omdbLoading } = useOMDBData(movieDetails?.imdbId);

  const isFocused = navigation.isFocused();

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
  }, [finalMovieDetails]);

  //~~ --------------------------------
  //~~ Setup Header Right Components
  const HeaderRight = () => (
    <TouchableOpacity
      className="pr-2 mr-[-10] pl-1"
      activeOpacity={0.5}
      onPress={async () => {
        const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");
        if (yesDelete) {
          if (storedMovie?.id) {
            movieActions.removeShow(storedMovie?.id);
          }
          // If we are deep in a stack go back to starting point
          router.dismissAll();
        }
      }}
    >
      <SymbolView name="trash" tintColor={colors.deleteRed} />
    </TouchableOpacity>
  );
  const HeaderRightAdd = () => (
    <TouchableOpacity
      className="pr-2 mr-[-10] pl-1 pt-1"
      activeOpacity={0.5}
      onPress={() => handleAddMovie()}
      disabled={movieAdding}
    >
      {/* <AddIcon color={colors.text} /> */}
      <SymbolView name="plus.app" tintColor={colors.text} size={30} />
    </TouchableOpacity>
  );
  //~~ --------------------------------

  // Sets the title and Header icons
  // needs to update
  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: movieTitle || "", //storedMovie?.title || movieDetails?.title || "",
      headerRight: existsInSaved ? HeaderRight : HeaderRightAdd,
      // headerLeft: () => (
      //   <Pressable onPress={() => router.back()} className="ml-[-8]">
      //     <View className="flex-row items-center">
      //       <SymbolView name="chevron.backward" />
      //       <Text className="text-lg ">Back</Text>
      //     </View>
      //   </Pressable>
      // ),
    };
    navigation.setOptions(options);
  }, [movieId, existsInSaved, movieTitle, isLoading, colorScheme]);

  const backgroundStartColor = "#000000";
  const backgroundEndColor = "#FFFFFF";

  // if (!isFocused)
  //   return (
  //     <LinearGradient
  //       colors={[backgroundStartColor, backgroundEndColor]}
  //       style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
  //     />
  //   );
  // Once we are focused and not loading, update the local state
  // Local state will be used to update the component
  useEffect(() => {
    if (isFocused && !isLoading) {
      setFinalMovieDetails(movieDetails);
      setMovieTitle(storedMovie?.title || movieDetails?.title || "");
    }
  }, [isFocused, isLoading]);
  return (
    <View className="flex-1">
      {existsInSaved ? (
        <Image
          source={{ uri: finalMovieDetails?.posterURL }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.2,
            resizeMode: "stretch",
          }}
        />
      ) : (
        <LinearGradient
          colors={[backgroundStartColor, backgroundEndColor]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
        />
      )}
      <ScrollView style={{ marginTop: headerHeight + 5, flexGrow: 1 }}>
        {/* IMAGE and DESC */}
        <View>
          <MDImageDescRow
            movieDetails={finalMovieDetails as MovieDetails}
            existsInSaved={existsInSaved}
          />
        </View>
        {/* MOVIE RATINGS */}
        <View className="pt-1 my-1">
          <MDRatings movieDetails={movieDetails} omdbData={omdbData} />
        </View>
        {/* MOVIE DETAILS */}
        <View className="pt-1 my-1">
          <MDDetails
            movieDetails={finalMovieDetails as MovieDetails}
            omdbData={omdbData}
            existsInSaved={existsInSaved}
          />
        </View>
        {/* WHERE TO WATCH */}
        <View className="my-1">
          <HiddenContainerWatchProviders title="Where to Watch" movieId={movieId} height={85}>
            <MDWatchProviders movieId={finalMovieDetails?.id} />
          </HiddenContainerWatchProviders>
        </View>
        {/* RECOMMENDATIONS */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated title="Recommended" height={imageHeight + 30}>
            <MDMovieRecommendations movieId={finalMovieDetails?.id} />
          </HiddenContainerAnimated>
        </View>
        {/* VIDEOS */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated title="Videos" height={145}>
            <MDMovieVideos movieId={finalMovieDetails?.id} />
          </HiddenContainerAnimated>
        </View>
        {/* CAST */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated title="Cast" startOpen={true}>
            <MDMovieCast movieId={finalMovieDetails?.id} />
          </HiddenContainerAnimated>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(MovieDetailsContainer);
