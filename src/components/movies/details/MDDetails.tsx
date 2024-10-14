import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MovieDetails } from "@/store/dataHooks";
import { addDelimitersToArray, formatAsUSDCurrency, formatTime } from "@/utils/utils";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails;
};

const MDDetails = ({ movieDetails }: Props) => {
  return (
    <Animated.View className="mt-1 relative" entering={FadeIn.duration(700)}>
      <View
        className="absolute bg-white opacity-50"
        style={{
          ...StyleSheet.absoluteFillObject,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.4,
          shadowRadius: 2,
        }}
      />
      <View className="flex-row pl-3 pr-2 py-2">
        {/* Left Side Info */}
        <View className="flex-col">
          <View className="flex-row">
            <Text className="font-semibold pr-1">Released:</Text>
            <Text>{movieDetails?.releaseDate.formatted}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-semibold pr-1">Length:</Text>
            <Text>{formatTime(movieDetails.runtime).verbose}</Text>
          </View>
          {movieDetails?.budget !== 0 && (
            <View className="flex-row">
              <Text className="font-semibold pr-1">Budget:</Text>
              <Text>{formatAsUSDCurrency(movieDetails?.budget, false)}</Text>
            </View>
          )}
        </View>
        {/* Right Side Info */}
        <View className="flex-1 ml-4 flex-col">
          <Text className="font-semibold">Genres:</Text>
          <View className="flex-row gap-2">
            <Text>{addDelimitersToArray(movieDetails.genres, ", ")}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default MDDetails;
