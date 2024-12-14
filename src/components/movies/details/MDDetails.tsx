import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { MovieDetails, OMDBData } from "@/store/dataHooks";
import { addDelimitersToArray, formatAsUSDCurrency, formatTime } from "@/utils/utils";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import MDBackground from "./MDBackground";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails | undefined;
  omdbData: OMDBData | undefined;
};
const MDDetails = ({ movieDetails, omdbData }: Props) => {
  return (
    <View className="">
      <MDBackground />

      <View className="flex-row pl-3 pr-2 py-2">
        {/* Left Side Info */}
        <View className="flex-col">
          <View className="flex-row">
            <Text style={styles.textLabel}>Released:</Text>
            {movieDetails?.id ? (
              <Text style={styles.textDesc}>{movieDetails?.releaseDate?.formatted}</Text>
            ) : (
              <View className="flex-1 justify-center">
                <Skeleton className=" h-3" />
              </View>
            )}
          </View>

          <View className="flex-row">
            <Text style={styles.textLabel}>Length:</Text>
            {movieDetails?.id ? (
              <Text style={styles.textDesc}>
                {movieDetails?.runtime && formatTime(movieDetails.runtime).verbose}
              </Text>
            ) : (
              <View className="flex-1 justify-center">
                <Skeleton className=" h-3" />
              </View>
            )}
            <Text style={styles.textLabel} className="ml-1">
              Rated:
            </Text>
            {omdbData?.rated ? (
              <Text className="font-semibold ml-1">({omdbData?.rated})</Text>
            ) : (
              <View className="flex-1 justify-center">
                <Skeleton className=" h-3" />
              </View>
            )}
          </View>

          {movieDetails?.budget !== 0 && (
            <View className="flex-row">
              <Text style={styles.textLabel}>Budget:</Text>
              <Text style={styles.textDesc}>
                {formatAsUSDCurrency(movieDetails?.budget, false)}
              </Text>
            </View>
          )}
        </View>
        {/* Right Side Info */}
        <View className="flex-1 ml-4">
          <Text style={styles.textLabel}>Genres:</Text>
          <View className="flex-row gap-2">
            <Text numberOfLines={2} style={styles.textDesc}>
              {addDelimitersToArray(movieDetails?.genres, ", ")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textLabel: {
    fontWeight: "600",
    paddingRight: 4,
    fontSize: 15,
  },
  textDesc: {
    fontSize: 15,
  },
});
export default React.memo(MDDetails);
