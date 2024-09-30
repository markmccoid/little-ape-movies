import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import MovieImage from "../common/MovieImage";
import { MovieSearchResults } from "@/store/store.search";
import { MovieStore } from "@/store/store.shows";
import { AddCircleIcon, AddIcon, CheckCircleIcon } from "../common/Icons";
import { useCustomTheme } from "@/utils/colorThemes";
import { Link, usePathname } from "expo-router";
import useImageSize from "@/hooks/useImageSize";

const { width, height } = Dimensions.get("window");
const NUMCOLUMNS = 3;
const CONTAINER_PADDING = 15; // Left and right padding for the container
const GAP = 10; // Desired gap between images
// Calculate the available width for images
const availableWidth = width - 2 * CONTAINER_PADDING;
// Calculate the width of each image
const imageWidth3 = (availableWidth - (NUMCOLUMNS - 1) * GAP) / NUMCOLUMNS;
// Calculate the height of each image (assuming 1.5 aspect ratio)
const imageHeight3 = imageWidth3 * 1.5;

//~~  SearchResult Component
type Props = {
  movie: MovieSearchResults;
  numColumns: number;
  onAddMovie: MovieStore["actions"]["addShow"];
  onRemoveMovie: MovieStore["actions"]["removeShow"];
};
const SearchResult = ({ movie, numColumns = 3, onAddMovie, onRemoveMovie }: Props) => {
  const pathName = usePathname();
  const linkPath = useMemo(() => (pathName === "/search" ? "./search/" : "../"), [pathName]);
  const [isLocallyAdded, setIsLocallyAdded] = useState(movie.existsInSaved);
  const { imageHeight: imageHeight2, imageWidth: imageWidth2 } = useImageSize("2column");
  let imageWidth = imageWidth3;
  let imageHeight = imageHeight3;
  if (numColumns === 2) {
    imageWidth = imageWidth2;
    imageHeight = imageHeight2;
  }
  const { colors } = useCustomTheme();
  useEffect(() => {
    setIsLocallyAdded(movie.existsInSaved);
  }, [movie.existsInSaved]);

  const handleAddRemoveMovie = () => {
    setIsLocallyAdded((prev) => !prev);
    if (isLocallyAdded) {
      onRemoveMovie(movie.id);
    } else {
      onAddMovie(movie);
    }
  };

  return (
    <View
      className={`my-1 mb-[20] border-hairline border-border `}
      style={{
        width: imageWidth,
        height: imageHeight + 20,
        overflow: "hidden",
        borderRadius: 10,
        shadowColor: colors.border,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      }}
    >
      <Link href={`${linkPath}${movie.id}`} style={{ zIndex: 0 }}>
        <View>
          <MovieImage
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            posterURL={movie.posterURL}
            title={movie.title}
            imageStyle={{
              borderRadius: 10,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              overflow: "hidden",
            }}
          />
        </View>
      </Link>
      <TouchableOpacity className="flex-1" activeOpacity={0.9} onPress={handleAddRemoveMovie}>
        <View
          style={[{ alignItems: "center", justifyContent: "center", marginTop: -5, height: 20 }]}
          className={`flex-1 border-t-hairline border-t-border rounded-b-lg ${
            isLocallyAdded ? "bg-selected" : "bg-card"
          }`}
        >
          <Text numberOfLines={1} className="px-1 text-text">
            {movie.title}
          </Text>
        </View>
        <View
          className={`absolute rounded-t-md border-hairline border-border border-b-0 ${
            isLocallyAdded ? "bg-selected" : "bg-card"
          }`}
          style={{
            left: imageWidth / 2 - imageWidth / 4 / 2,
            bottom: 23,
            width: imageWidth / 4,
            height: imageHeight / 7.5,
          }}
        >
          <View className="flex-1 items-center justify-center">
            {isLocallyAdded ? (
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

export default React.memo(SearchResult);
