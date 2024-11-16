import { View, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MovieImage from "../common/MovieImage";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import { MovieStore } from "@/store/store.shows";
import { AddCircleIcon, AddIcon, CheckCircleIcon } from "../common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";
import { Link, router, useFocusEffect, usePathname, useSegments } from "expo-router";
import useImageSize from "@/hooks/useImageSize";
import { Text } from "@/components/ui/text";
//~~  SearchResult Component
type Props = {
  movie: MovieSearchResults;
  numColumns: 2 | 3;
  spacing: { bottomMargin: number; extraHeight: number };
  isMovieLoading: boolean;
  setIsMovieLoading: (arg: boolean) => void;
  onAddMovie: MovieStore["actions"]["addShow"];
  onRemoveMovie: MovieStore["actions"]["removeShow"];
};
const SearchResult = ({
  movie,
  spacing,
  numColumns = 3,
  isMovieLoading,
  setIsMovieLoading,
  onAddMovie,
  onRemoveMovie,
}: Props) => {
  const pathName = usePathname();

  const linkPath = useMemo(
    () => (pathName.includes("/search") ? "/search/" : "/home/"),
    [pathName]
  );

  const [isLocallyAdded, setIsLocallyAdded] = useState(movie.existsInSaved);
  const { imageHeight, imageWidth } = useImageSize(numColumns);

  const { colors } = useCustomTheme();
  useEffect(() => {
    setIsLocallyAdded(movie.existsInSaved);
  }, [movie.existsInSaved]);

  //! --------------
  // using this so that double taps don't go to route twice
  // state didn't work, but refs need to be set back to false outside of
  // function they are set in since synchronous
  // const pickedRef = React.useRef(false);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     pickedRef.current = false;
  //   }, [])
  // );
  //! --------------

  const handleAddRemoveMovie = async () => {
    setIsLocallyAdded((prev) => !prev);
    await new Promise((resolve) => setTimeout(() => resolve("done"), 0));
    if (isLocallyAdded) {
      onRemoveMovie(movie.id);
    } else {
      onAddMovie(movie);
    }
  };

  //~

  const handlePressToMovie = async () => {
    // Prevent further presses if a movie is already loading
    if (isMovieLoading) return;

    // Set loading state to true
    setIsMovieLoading(true);
    console.log("MOVIE TO VIEW", `${linkPath}${movie.id}`);
    try {
      // delay so
      await new Promise((resolve) => setTimeout(resolve, 0));
      // Navigate to the movie's detail page
      // router.navigate(`${linkPath}${movie.id}`, {params: {movieId: }});
      router.push({
        pathname: `${linkPath}[showId]`,
        params: { showId: movie.id },
      });
      // router.push(`${linkPath}${movie.id}`, { relativeToDirectory: true });
      // router.push(`${linkPath}${movie.id}`, {relativeToDirectory: true});
    } catch (error) {
      // Reset loading state after navigation completes
      console.log("Error navigating to movie detail (SearchResult.tsx)");
    }
  };
  return (
    <View
      className={`border-hairline `}
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
      <Pressable onPress={handlePressToMovie} style={{ zIndex: 0 }}>
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
          className={`flex-1 border-t-hairline  rounded-b-lg  ${
            isLocallyAdded ? "bg-selected" : "bg-card"
          }`}
        >
          <Text numberOfLines={1} className={`px-1 ${isLocallyAdded && "text-text"}`}>
            {movie.title}
          </Text>
        </View>
        <View
          className={`absolute rounded-t-md border-hairline  ${
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
              <CheckCircleIcon color={"black"} size={18} />
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
