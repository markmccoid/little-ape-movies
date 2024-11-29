import { View, Text, Image, Dimensions, Pressable, InteractionManager } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { ShowItemType } from "@/store/store.shows";
import { getMovieItemSizing } from "./movieItemHelpers";
import MovieImage from "@/components/common/MovieImage";
import MovieItemActionBar from "./MovieItemActionBar";
import { useCustomTheme } from "@/lib/colorThemes";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const availableWidth = screenWidth - 20; // Subtract left and right margins
// const numColumns = 2; // For a 2-column layout
// const gapWidth = 10; // Gap between images
// const imageWidth = screenWidth / 2.2; // (availableWidth - (numColumns - 1) * gapWidth) / numColumns;
// const imageHeight = imageWidth * 1.5;
type Props = {
  movie: ShowItemType;
  isMovieLoading: boolean;
  setIsMovieLoading: (arg: boolean) => void;
};
const MovieItem = ({ movie, isMovieLoading, setIsMovieLoading }: Props) => {
  const { imageHeight, imageWidth, verticalMargin, extraHeight, horizontalMargin, gap } =
    getMovieItemSizing();
  const router = useRouter();
  const { colors } = useCustomTheme();

  //~ --- handleMovieSelect ---
  const handleMovieSelect = async () => {
    // Prevent further presses if a movie is already loading
    if (isMovieLoading) return;
    // Set loading state to true
    setIsMovieLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1));
      // Navigate to the movie's detail page
      router.push(`/(auth)/(drawer)/(tabs)/home/${movie.id}`);
    } catch (error) {
      // Reset loading state after navigation completes
      console.log("Error navigating to movie detail (MovieItem.tsx)");
    }
  };

  return (
    <View
      style={{
        shadowColor: colors.text,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3,
      }}
    >
      <View
        className="relative border-hairline border-border"
        style={{
          borderRadius: 10,
          overflow: "hidden",
          marginVertical: verticalMargin,
          marginRight: gap,
          height: imageHeight + extraHeight,
        }}
      >
        <View
          className="absolute bottom-0 w-full z-10 bg-red-500 "
          style={{
            height: extraHeight + verticalMargin,
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          <MovieItemActionBar movie={movie} />
        </View>
        {/* <Link href={`/(auth)/(drawer)/(tabs)/home/${movie.id}`} push disabled> */}

        <Pressable
          onPress={handleMovieSelect}
          disabled={isMovieLoading}
          // onPress={async () => {
          //   // if not already routed, push route and set ref
          //   // ref will be reset in useEffect
          //   // if (!pickedRef.current) {
          //   console.log("MovieID-Loading?", movie.id, isMovieLoading);
          //   if (isMovieLoading) return;
          //   setIsMovieLoading(true);
          //   await new Promise((resolve) => setTimeout(() => resolve("done"), 1));
          //   router.push(`/(auth)/(drawer)/(tabs)/home/${movie.id}`);
          //   pickedRef.current = true;
          //   setIsMovieLoading(false);
          //   // } else {
          //   //   pickedRef.current = false;
          //   // }
          // }}
        >
          <MovieImage
            posterURL={movie?.posterURL}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            title={movie?.title}
            resizeMode="contain"
            imageStyle={
              {
                // borderRadius: 10,
                // borderBottomLeftRadius: 0,
                // borderBottomRightRadius: 0,
                // overflow: "hidden",
              }
            }
          />
        </Pressable>
        {/* </Link> */}
      </View>
    </View>
  );
};

export default MovieItem;

/* 
<Link href={`./home/${movie.id}`}>
  <Image
    source={{ uri: movie.posterURL }}
    style={{ width: 140, height: 200, resizeMode: "contain" }}
    className="rounded-lg m-1 border border-border"
  />
</Link>
<TouchableOpacity className="flex-col ml-3 flex-1" onPress={() => removeMovie(movie.id)}>
  <Text className="text-text text-lg font-semibold text-center" numberOfLines={2}>
    {movie.id}
    {movie.title}
  </Text>
  <Image
    source={{ uri: movie.backdropURL }}
    style={{ width: 230, height: 150, resizeMode: "contain" }}
  />
  <Text className="text-text">{dayjs(movie.dateAddedEpoch).format("MM/DD/YYYY mm:ss")}</Text>
  
</TouchableOpacity> 
*/
