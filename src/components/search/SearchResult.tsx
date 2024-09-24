import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MovieImage from "../common/MovieImage";
import { MovieSearchResults } from "@/store/store.search";
import { MovieStore } from "@/store/store.shows";
import { AddCircleIcon, AddIcon, CheckCircleIcon } from "../common/Icons";
import { useCustomTheme } from "@/utils/colorThemes";
import { Link } from "expo-router";

const { width, height } = Dimensions.get("window");
const NUMCOLUMNS = 3;
const CONTAINER_PADDING = 15; // Left and right padding for the container
const GAP = 10; // Desired gap between images
// Calculate the available width for images
const availableWidth = width - 2 * CONTAINER_PADDING;
// Calculate the width of each image
const imageWidth = (availableWidth - (NUMCOLUMNS - 1) * GAP) / NUMCOLUMNS;
// Calculate the height of each image (assuming 1.5 aspect ratio)
const imageHeight = imageWidth * 1.5;

//~~  SearchResult Component
type Props = {
  movie: MovieSearchResults;
  onAddMovie: MovieStore["actions"]["addShow"];
  onRemoveMovie: MovieStore["actions"]["removeShow"];
};
const SearchResult = ({ movie, onAddMovie, onRemoveMovie }: Props) => {
  const { colors } = useCustomTheme();
  // const [color, setColor] = useState({ from: "green", to: colors.primary });
  const handleAddRemoveMovie = () => {
    if (movie.existsInSaved) {
      // setColor({ from: "green", to: colors.primary });
      onRemoveMovie(movie.id);
    } else {
      // setColor({ from: colors.primary, to: "green" });
      onAddMovie(movie);
    }
  };
  return (
    <View
      className={`my-1 mb-[20] border-hairline border-border rounded-lg`}
      style={{
        width: imageWidth + 1,
        height: imageHeight + 20,
        shadowColor: colors.border,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      }}
    >
      <Link href={`/(auth)/(drawer)/(tabs)/search/${movie.id}`} style={{ zIndex: 0 }}>
        <View>
          <MovieImage
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            posterURL={movie.posterURL}
            title={movie.title}
            imageStyle={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
        </View>
      </Link>
      <TouchableOpacity className="flex-1" activeOpacity={0.9} onPress={handleAddRemoveMovie}>
        <View
          style={[{ alignItems: "center", justifyContent: "center", marginTop: -5, height: 20 }]}
          className={`flex-1 border-t-hairline border-t-border rounded-b-lg ${
            movie.existsInSaved ? "bg-selected" : "bg-card"
          }`}
        >
          <Text numberOfLines={1} className="px-1 text-text">
            {movie.title}
          </Text>
        </View>
        <View
          className={`absolute rounded-t-md border-hairline border-border border-b-0 ${
            movie.existsInSaved ? "bg-selected" : "bg-card"
          }`}
          style={{
            left: imageWidth / 2 - imageWidth / 4 / 2,
            bottom: 23,
            width: imageWidth / 4,
            height: imageHeight / 7.5,
          }}
        >
          <View className="flex-1 items-center justify-center">
            {movie.existsInSaved ? (
              <CheckCircleIcon color={colors.text} size={18} />
            ) : (
              <AddIcon color={colors.text} size={15} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 150,
    position: "relative", // Ensure the container can be a reference for overlay
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 150,
    backgroundColor: "green",
  },
  overlay: {
    position: "absolute",
    bottom: -10, // Align at the bottom of the image
    left: 0,
    right: 0,
    height: 22,
    // backgroundColor: "rgba(0, 0, 0, 1)", // Semi-transparent strip
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 14,
  },
});

export default React.memo(SearchResult);
