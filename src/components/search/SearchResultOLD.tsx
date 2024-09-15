import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import useMovieStore from "@/store/store.movie";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MovieSearchResults } from "@/store/store.search";
import MovieImage from "../common/MovieImage";
import { AddCircleIcon } from "../common/Icons";
import { Link } from "expo-router";
import { HabitButton } from "../common/animations/AnimButton";
import { MotiView } from "moti";

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

const SearchResult = ({ movie }: Props) => {
  const actions = useMovieStore((state) => state.actions);

  const handleAddRemoveMovie = () => {
    if (movie.existsInSaved) {
      actions.removeMovie(movie.id);
    } else {
      actions.addMovie(movie);
    }
  };
  return (
    <MotiView
      from={{ backgroundColor: movie.existsInSaved ? "blue" : "green" }}
      animate={{ backgroundColor: movie.existsInSaved ? "green" : "blue" }}
      className={`flex-column rounded-lg my-1 relative ${
        movie.existsInSaved ? "bg-green-600" : "bg-primary"
      }`}
    >
      {/* <View
        className={`flex-column rounded-lg my-1 border-hairline border-border z-10 ${
          movie.existsInSaved ? "bg-green-600" : "bg-primary"
        }`}
      > */}
      <Link href={`./search/${movie.id}`} style={{ zIndex: 0 }}>
        <MovieImage
          posterURL={movie.posterURL}
          title={movie.title}
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          imageStyle={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            // opacity: 50,
          }}
        />
      </Link>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleAddRemoveMovie}
        style={{ bottom: 0, left: 0, right: 0 }}
      >
        <View
          className={`py-1 width-full mt-[-10] border border-border
      rounded-b-lg h-[30] flex-row justify-center z-10`}
        >
          <AddCircleIcon color="white" size={20} />
        </View>
      </TouchableOpacity>
      {/* </View> */}
    </MotiView>
  );
};

export default SearchResult;
