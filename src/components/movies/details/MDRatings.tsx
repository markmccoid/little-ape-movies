import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { MovieDetails, OMDBData } from "@/store/dataHooks";
import MDBackground from "./MDBackground";
import RottenTomatoes from "./ratings/RottenTomatoes";
import IMDBRating from "./ratings/IMDBRating";
import Metascore from "./ratings/Metascore";
import UserRating from "../../common/UserRating";

type Props = {
  movieDetails: MovieDetails | undefined;
  omdbData: OMDBData | undefined;
};
const MDRatings = ({ movieDetails, omdbData }: Props) => {
  return (
    <View className="flex-row items-center">
      <View className="w-1/2">
        <UserRating />
      </View>
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
