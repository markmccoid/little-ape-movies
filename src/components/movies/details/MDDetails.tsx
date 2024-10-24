import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MovieDetails } from "@/store/dataHooks";
import { addDelimitersToArray, formatAsUSDCurrency, formatTime } from "@/utils/utils";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails;
};

const MDDetails = ({ movieDetails }: Props) => {
  return (
    <Animated.View
      className="mt-1 relative"
      // entering={FadeIn.duration(700)}
      // exiting={FadeOut.duration(500)}
    >
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
            <Text style={styles.textLabel}>Released:</Text>
            <Text style={styles.textDesc}>{movieDetails?.releaseDate?.formatted}</Text>
          </View>
          <View className="flex-row">
            <Text style={styles.textLabel}>Length:</Text>
            <Text style={styles.textDesc}>
              {movieDetails?.runtime && formatTime(movieDetails.runtime).verbose}
            </Text>
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
        <View className="flex-1 ml-4 flex-col">
          <Text style={styles.textLabel}>Genres:</Text>
          <View className="flex-row gap-2">
            <Text style={styles.textDesc}>{addDelimitersToArray(movieDetails?.genres, ", ")}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
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
export default MDDetails;
