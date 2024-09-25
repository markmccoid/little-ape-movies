import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import dayjs from "dayjs";
import useImageSize from "@/hooks/useImageSize";
import { getMovieItemSizing } from "./movieItemHelpers";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const availableWidth = screenWidth - 20; // Subtract left and right margins
// const numColumns = 2; // For a 2-column layout
// const gapWidth = 10; // Gap between images
// const imageWidth = screenWidth / 2.2; // (availableWidth - (numColumns - 1) * gapWidth) / numColumns;
// const imageHeight = imageWidth * 1.5;
type Props = {
  movie: ShowItemType;
};
const MovieItem = ({ movie }: Props) => {
  const { imageHeight, imageWidth, margin, extraHeight } = getMovieItemSizing();

  return (
    <View
      className="rounded-lg relative"
      style={{
        marginVertical: margin,
        height: imageHeight + extraHeight,
        shadowColor: "#000",
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.53,
        shadowRadius: 2.62,
      }}
    >
      <View
        className="absolute p-1 bottom-0 w-full z-0 bg-red-500 rounded-b-lg"
        style={{ maxHeight: extraHeight + margin }}
      >
        <TouchableOpacity className="" onPress={() => console.log("HI Pressed")}>
          <Text>Action Bar</Text>
        </TouchableOpacity>
      </View>
      <Link href={`./home/${movie.id}`}>
        <Image
          source={{ uri: movie.posterURL }}
          style={{ width: imageWidth, height: imageHeight, resizeMode: "contain" }}
          className="rounded-t-lg"
        />
      </Link>
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
