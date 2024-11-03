import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { MovieDetails, OMDBData } from "@/store/dataHooks";
import MDBackground from "./MDBackground";
import RottenTomatoes from "./ratings/RottenTomatoes";
import IMDBRating from "./ratings/IMDBRating";
import Metascore from "./ratings/Metascore";
import UserRating from "../../common/UserRating";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";

type Props = {
  movieDetails: MovieDetails | undefined;
  omdbData: OMDBData | undefined;
  storedMovie: ShowItemType | undefined;
};
const MDRatings = ({ movieDetails, omdbData, storedMovie }: Props) => {
  const updateShow = useMovieActions().updateShow;
  const existsInSaved = storedMovie?.existsInSaved;
  const updateRating = (rating: number) => {
    if (!movieDetails?.id) return;

    updateShow(movieDetails?.id, { rating });
  };
  return (
    <View className="flex-row items-center">
      {existsInSaved && (
        <View className="w-1/3">
          <UserRating updateRating={updateRating} rating={storedMovie?.rating} />
        </View>
      )}
      <MDBackground />
      <View className="flex-row items-center py-2 px-3 justify-between flex-1">
        {/* Need to not show if there is NO rating */}
        <View style={{ flex: 1 }}>
          <RottenTomatoes
            rating={omdbData?.rottenTomatoesRating}
            score={omdbData?.rottenTomatoesScore}
          />
        </View>
        <View style={{ flex: 1 }}>
          <IMDBRating
            rating={omdbData?.imdbRating}
            votes={omdbData?.imdbVotes}
            imdbId={movieDetails?.imdbId}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Metascore metascore={omdbData?.metascore} imdbId={movieDetails?.imdbId} />
        </View>
      </View>
    </View>
  );
};

export default MDRatings;
