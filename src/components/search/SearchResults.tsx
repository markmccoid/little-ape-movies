import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { AddCircleIcon } from "../common/Icons";
import MovieImage from "../common/MovieImage";
import useMovieStore from "@/store/store.movie";
import { MovieSearchResults } from "@/store/store.search";
import { MotiView } from "moti";
import { useCustomTheme } from "@/utils/colorThemes";

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
};

const ImageWithOverlay = ({ movie }: Props) => {
  const { colors } = useCustomTheme();
  const actions = useMovieStore((state) => state.actions);
  // Local state to manage color
  const [color, setColor] = useState({
    from: movie.existsInSaved ? colors.primary : "green",
    to: movie.existsInSaved ? "green" : colors.primary,
  });

  // Sync the color when `movie.existsInSaved` changes
  useEffect(() => {
    setColor({
      from: movie.existsInSaved ? colors.primary : "green",
      to: movie.existsInSaved ? "green" : colors.primary,
    });
  }, [movie.existsInSaved]);

  const handleAddRemoveMovie = () => {
    if (movie.existsInSaved) {
      setColor({ from: "green", to: colors.primary });
      actions.removeMovie(movie.id);
    } else {
      setColor({ from: colors.primary, to: "green" });
      actions.addMovie(movie);
    }
  };
  return (
    <View className={`flex-column rounded-lg my-1 relative mb-[20] `}>
      {/* <Image source={{ uri: movie.posterURL }} style={styles.image} /> */}
      <MovieImage
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        posterURL={movie.posterURL}
        title={movie.title}
      />
      {/* <View style={styles.overlay}>
        <Text style={styles.overlayText}>Overlay Text</Text>
      </View> */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleAddRemoveMovie}
        // className={`${movie.existsInSaved ? "bg-green-600" : "bg-primary"}`}
      >
        <MotiView
          from={{ backgroundColor: color.from }}
          animate={{ backgroundColor: color.to }}
          style={styles.overlay}
        >
          <MotiView
            from={{ backgroundColor: color.from }}
            animate={{ backgroundColor: color.to }}
            className={`absolute top-[-10] rounded-t-md pt-[4] px-[6] pb-[5] ${
              movie.existsInSaved ? "bg-green-600" : "bg-primary"
            }`}
          >
            <AddCircleIcon color="white" size={18} />
          </MotiView>
        </MotiView>
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

export default ImageWithOverlay;
