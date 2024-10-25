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
import { MovieDetails, useMovieDetailData } from "@/store/dataHooks";
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
import { useSearchStore } from "@/store/store.search";

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  //!!
  const [finalMovieDetails, setFinalMovieDetails] = useState<MovieDetails>();
  const [movieTitle, setMovieTitle] = useState<string>();
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
  const existsInSaved = !!storedMovie?.id;
  const { movieDetails, isLoading } = useMovieDetailData(movieId);

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
  // }, [movieId, isLoading, existsInSaved]);
  const HeaderRight = () => (
    <TouchableOpacity
      className="pr-2 mr-[-10] pl-1"
      activeOpacity={0.5}
      onPress={async () => {
        const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");
        if (yesDelete) {
          movieActions.removeShow(storedMovie?.id);
          // If we are deep in a stack go back to starting point
          router.dismissAll();
        }
      }}
    >
      <DeleteIcon />
    </TouchableOpacity>
  );
  const HeaderRightAdd = () => (
    <TouchableOpacity
      className="pr-2 mr-[-10] pl-1"
      activeOpacity={0.5}
      onPress={() => handleAddMovie()}
      disabled={movieAdding}
    >
      <AddIcon color={colors.text} />
    </TouchableOpacity>
  );

  //~~ OLD Header code
  // const HeaderRight1 = useCallback(() => {
  //   // console.log("UseCallbac", existsInSaved, storedMovie);
  //   if (storedMovie) {
  //     return (
  //       <TouchableOpacity
  //         className="pr-2 mr-[-10] pl-1"
  //         activeOpacity={0.5}
  //         onPress={async () => {
  //           const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");
  //           if (yesDelete) {
  //             movieActions.removeShow(storedMovie.id);
  //             // If we are deep in a stack go back to starting point
  //             router.dismissAll();
  //           }
  //         }}
  //       >
  //         <DeleteIcon />
  //       </TouchableOpacity>
  //     );
  //   }
  //   return (
  //     <TouchableOpacity
  //       className="pr-2 mr-[-10] pl-1"
  //       activeOpacity={0.5}
  //       onPress={() => handleAddMovie()}
  //       disabled={movieAdding}
  //     >
  //       <AddIcon color={colors.text} />
  //     </TouchableOpacity>
  //   );
  // }, [colorScheme, existsInSaved, isLoading, movieId, movieDetails]);

  // NOTE: any changes to when affects the useCallback on the HeaderRight
  //  needs to be added to the useLayoutEffect []
  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: movieTitle || "", //storedMovie?.title || movieDetails?.title || "",
      headerRight: existsInSaved ? HeaderRight : HeaderRightAdd,
      headerLeft: () => (
        <Pressable onPress={() => router.back()}>
          <View className="flex-row items-center">
            <SymbolView name="chevron.backward" />
            <Text className="text-lg font-semibold">Back</Text>
          </View>
        </Pressable>
      ),
    };
    navigation.setOptions(options);
  }, [movieId, existsInSaved, movieTitle, isLoading, movieDetails]);

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
        {/* <View className="flex-1 flex-col"> */}
        {/* <Pressable onPress={() => router.push("/home/1184918/917496")}>
          <Text>Link to 1184918/917496</Text>
        </Pressable> */}
        <View>
          <MDImageDescRow
            movieDetails={finalMovieDetails as MovieDetails}
            existsInSaved={existsInSaved}
          />
        </View>
        <View className="pt-1 my-1">
          <MDDetails
            movieDetails={finalMovieDetails as MovieDetails}
            existsInSaved={existsInSaved}
          />
        </View>
        {/* WHERE TO WATCH */}
        <View className="my-1">
          <HiddenContainerWatchProviders title="Where to Watch" movieId={movieId} height={85}>
            <MDWatchProviders movieId={finalMovieDetails?.id} />
          </HiddenContainerWatchProviders>
        </View>
        {/* Other movie recomendations */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated title="Recommended" style={{ height: 75 }} height={200}>
            <MDMovieRecommendations movieId={finalMovieDetails?.id} />
          </HiddenContainerAnimated>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(MovieDetailsContainer);
