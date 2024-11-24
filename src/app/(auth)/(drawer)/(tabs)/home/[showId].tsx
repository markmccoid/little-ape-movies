import React, { useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";
import { View, Text, Image, Dimensions } from "react-native";
import useMovieStore from "@/store/store.shows";
import { LinearGradient } from "expo-linear-gradient";
const { width, height: screenHeight } = Dimensions.get("window");

const MovieDetailHome = () => {
  const { showId } = useGlobalSearchParams<{ showId: string }>();
  console.log("MOVIE ID HOME---", showId);
  const { storedMovie } = useMovieStore((state) => ({
    storedMovie: state.actions.getShowById(parseInt(showId)),
  }));

  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setShouldRender(true);
    });
  }, []);
  const backgroundStartColor = storedMovie?.posterColors?.primary?.color || "#000000";
  const backgroundEndColor = storedMovie?.posterColors?.darkestColor || "#FFFFFF";

  return (
    <View className="flex-1" style={{ minHeight: screenHeight }}>
      <LinearGradient
        colors={[backgroundStartColor, backgroundEndColor]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.4 }}
      />

      {shouldRender && <MovieDetailsContainer movieId={parseInt(showId, 10)} />}
    </View>
  );

  // - Title is set in MovieDetailsContainer useFocusEffect()
  // if (!isLoading && !omdbLoading) {
  //   return <MovieDetailsContainer movieId={parseInt(showId, 10)} />;
  // }
};

export default MovieDetailHome;
