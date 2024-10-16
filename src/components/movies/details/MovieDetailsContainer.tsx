import { View, Text, TouchableOpacity, Image, ScrollView, useColorScheme } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { MovieDetails, useMovieData, useMovieDetailData } from "@/store/dataHooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AddIcon, DeleteIcon } from "@/components/common/Icons";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { movieGetWatchProviders, movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { useDynamicAnimation } from "moti";

import MDImageDescRow from "./MDImageDescRow";
import MDDetails from "./MDDetails";
import HiddenContainer from "@/components/common/HiddenContainer/HiddenContainer";
import HiddenContainerAnimated from "@/components/common/HiddenContainer/HiddenContainerAnimated";
import { useCustomTheme } from "@/utils/colorThemes";
import { ColorSpace } from "react-native-reanimated";

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  useDynamicAnimation();
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

  //! TEMP
  React.useEffect(() => {
    const wp = async () => {
      const x = await movieGetWatchProviders(movieId.toString(), ["AU", "US"]);
      const y = x.data.results.US;
      y;
      console.log("WP", x.data.results.US);
    };
    wp();
  }, []);
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
  }, [movieId, isLoading, existsInSaved]);

  const HeaderRight = useCallback(() => {
    // console.log("UseCallbac", existsInSaved, storedMovie);
    if (storedMovie) {
      return (
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
    return (
      <TouchableOpacity
        className="pr-2 mr-[-10] pl-1"
        activeOpacity={0.5}
        onPress={() => handleAddMovie()}
        disabled={movieAdding}
      >
        <AddIcon color={colors.text} />
      </TouchableOpacity>
    );
  }, [colorScheme, storedMovie, existsInSaved, isLoading]);

  // NOTE: any changes to when affects the useCallback on the HeaderRight
  //  needs to be added to the useLayoutEffect []
  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: storedMovie?.title || movieDetails?.title || "",
      headerRight: HeaderRight,
      headerBackTitle: "Back",
    };
    navigation.setOptions(options);
  }, [movieId, isLoading, storedMovie, colorScheme]);

  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  const backgroundStartColor = "#000000";
  const backgroundEndColor = "#FFFFFF";
  // const backgroundStartColor = storedMovie?.posterColors?.background?.color || "#000000";
  // const backgroundEndColor = storedMovie?.posterColors?.lightestColor || "#FFFFFF";

  return (
    <View className="flex-1">
      {existsInSaved ? (
        <Image
          source={{ uri: movieDetails?.posterURL }}
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
        <View>
          <MDImageDescRow
            movieDetails={movieDetails as MovieDetails}
            existsInSaved={existsInSaved}
          />
        </View>
        <View className="pt-1 my-1">
          <MDDetails movieDetails={movieDetails as MovieDetails} existsInSaved={existsInSaved} />
        </View>
        {/* WHERE TO WATCH */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated
            title="Where to Watch"
            style={{ height: 75 }}
            height={75}
            // leftIconFunction={() => updateSearchObject({ genres: undefined })}
          >
            <View className=" ">
              <Text>Hidden now showing</Text>
            </View>
          </HiddenContainerAnimated>
        </View>
        {/* Other movie recomendations */}
        <View className="flex-1 my-1">
          <HiddenContainerAnimated
            title="Recommended"
            // titleInfo="Testing"
            style={{ height: 75 }}
            height={75}
            // leftIconFunction={() => updateSearchObject({ genres: undefined })}
          >
            <View className=" ">
              <Text>Hidden now showing</Text>
            </View>
          </HiddenContainerAnimated>
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetailsContainer;
