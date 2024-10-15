import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
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
import { useDynamicAnimation } from "moti";

import MDImageDescRow from "./MDImageDescRow";
import MDDetails from "./MDDetails";
import HiddenContainer from "@/components/common/HiddenContainer/HiddenContainer";
import HiddenContainer2 from "@/components/common/HiddenContainer/HiddenContainer2";

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
      <ScrollView style={{ marginTop: headerHeight + 5, flexGrow: 1 }}>
        {/* <LinearGradient
          colors={[backgroundStartColor, backgroundEndColor]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
        /> */}

        <View className="flex-1 flex-col">
          <View className="">
            <MDImageDescRow
              movieDetails={movieDetails as MovieDetails}
              existsInSaved={existsInSaved}
            />
          </View>
          <View className="pt-1">
            <MDDetails movieDetails={movieDetails as MovieDetails} existsInSaved={existsInSaved} />
          </View>
        </View>
        <View className="flex-1">
          <HiddenContainer2
            title="Watch"
            // titleInfo="Testing"
            style={{ height: 75 }}
            height={75}
            // leftIconFunction={() => updateSearchObject({ genres: undefined })}
          >
            <View className=" ">
              <Text>Hidden now showing</Text>
            </View>
          </HiddenContainer2>
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetailsContainer;
