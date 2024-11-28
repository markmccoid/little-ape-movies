import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { MovieDetails, OMDBData } from "@/store/dataHooks";
import MDBackground from "./MDBackground";
import RottenTomatoes from "./ratings/RottenTomatoes";
import IMDBRating from "./ratings/IMDBRating";
import Metascore from "./ratings/Metascore";
import UserRating from "../../common/UserRating";
import useMovieStore, { ShowItemType, useMovieActions } from "@/store/store.shows";
import { IMDBIcon } from "@/components/common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { Button } from "@/components/ui/button";
import * as Linking from "expo-linking";

type Props = {
  movieDetails: MovieDetails | undefined;
  omdbData: OMDBData | undefined;
  storedMovie: ShowItemType | undefined;
};
const MDRatings = ({ movieDetails, omdbData, storedMovie }: Props) => {
  const { colors } = useCustomTheme();
  const updateShow = useMovieActions().updateShow;
  const existsInSaved = storedMovie?.existsInSaved;
  const updateRating = (rating: number) => {
    if (!movieDetails?.id) return;

    updateShow(movieDetails?.id, { rating });
  };
  return (
    <View className="flex-row items-center">
      {existsInSaved && (
        <View className="w-1/4">
          <UserRating updateRating={updateRating} rating={storedMovie?.rating} />
        </View>
      )}
      <MDBackground />
      <View className="flex-row items-center py-2 px-3 justify-between flex-1">
        <View className="flex-1">
          <View className="flex-row">
            <Button
              size="sm"
              style={{ backgroundColor: colors.imdbYellow, borderWidth: StyleSheet.hairlineWidth }}
              onPress={() =>
                Linking.openURL(`https://www.imdb.com/title/${movieDetails?.imdbId}/`).catch((e) =>
                  console.log(`Error opening IMDB page for ${movieDetails?.imdbId} with error ${e}`)
                )
              }
            >
              <Text className="font-bold text-lg">IMDb</Text>
            </Button>
          </View>
        </View>
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
