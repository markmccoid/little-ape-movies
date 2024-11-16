import React, { useEffect, useLayoutEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailHome = () => {
  const { showId } = useGlobalSearchParams<{ showId: string }>();
  console.log("MOVIE ID HOME---", showId);

  // - Title is set in MovieDetailsContainer useFocusEffect()
  return <MovieDetailsContainer movieId={parseInt(showId, 10)} />;
};

export default MovieDetailHome;
