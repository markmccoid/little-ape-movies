import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import MovieImage from "../common/MovieImage";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import { MovieStore } from "@/store/store.shows";
import { AddCircleIcon, AddIcon, CheckCircleIcon } from "../common/Icons";
import { useCustomTheme } from "@/utils/colorThemes";
import { Link, router, usePathname, useSegments } from "expo-router";
import useImageSize from "@/hooks/useImageSize";

function getProcessedPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean); // Split and filter empty segments
  console.log("P/S", pathname, segments);
  if (segments.length === 1) {
    // If the path is "/home" or "/search"
    return `/${segments[0]}/`;
  }

  // if (segments.length === 2 && !isNaN(Number(segments[1]))) {
  // If the path is "/home/1234" or "/search/1234"
  return `/${segments[0]}/${segments[1]}/`;
  // }

  // return pathname; // Return the original path if no conditions match
}

//~~  SearchResult Component
type Props = {
  movie: MovieSearchResults;
  numColumns: 2 | 3;
  spacing: { bottomMargin: number; extraHeight: number };
  onAddMovie: MovieStore["actions"]["addShow"];
  onRemoveMovie: MovieStore["actions"]["removeShow"];
};
const SearchResult = ({ movie, spacing, numColumns = 3, onAddMovie, onRemoveMovie }: Props) => {
  const pathName = usePathname();
  const segments = useSegments();
  const target = useSearchStore((state) => state.detailTarget);
  // const linkPath = "/(auth)/(drawer)/_detailshowid/"; // getProcessedPath(pathName);

  // const linkPath = useMemo(() => (pathName === "/search" ? "./search/" : "../"), [pathName]);
  const linkPath = useMemo(
    () => (pathName.includes("/search") ? "/search/" : "/home/"),
    [pathName]
  );
  // console.log("SearchResult.tsx", pathName, segments, target, movie.id);
  const [isLocallyAdded, setIsLocallyAdded] = useState(movie.existsInSaved);
  const { imageHeight, imageWidth } = useImageSize(numColumns);

  // console.log("SearchResult -LinkPath", linkPath, pathName, `${linkPath}${movie.id}`);
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
      className={`border-hairline border-border `}
      style={{
        width: imageWidth,
        height: imageHeight + spacing.extraHeight,
        marginBottom: spacing.bottomMargin,
        overflow: "hidden",
        borderRadius: 10,
        shadowColor: colors.border,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      }}
    >
      {/* <Link href={`${linkPath}${movie.id}`} style={{ zIndex: 0 }} push> */}
      <Pressable onPress={() => router.push(`${linkPath}${movie.id}`)} style={{ zIndex: 0 }}>
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
      </Pressable>
      {/* </Link> */}
      <TouchableOpacity className="flex-1" activeOpacity={0.9} onPress={handleAddRemoveMovie}>
        <View
          style={[{ alignItems: "center", justifyContent: "center", marginTop: -5, height: 20 }]}
          className={`flex-1 border-t-hairline border-t-border rounded-b-lg  ${
            isLocallyAdded ? "bg-selected" : "bg-card"
          }`}
        >
          <Text numberOfLines={1} className="px-1 text-text">
            {movie.title}
          </Text>
        </View>
        <View
          className={`absolute rounded-t-md border-hairline border-border ${
            isLocallyAdded ? "bg-selected" : "bg-card"
          }`}
          style={{
            left: imageWidth / 2 - imageWidth / 4 / 2,
            bottom: 24,
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
