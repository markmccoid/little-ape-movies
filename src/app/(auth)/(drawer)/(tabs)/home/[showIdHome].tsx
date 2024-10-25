import React, { useEffect, useLayoutEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import MovieDetailsContainer from "@/components/movies/details/MovieDetailsContainer";

const MovieDetailHome = () => {
  const { showIdHome } = useGlobalSearchParams<{ showIdHome: string }>();
  console.log("MOVIE ID HOME---", showIdHome);

  // - Title is set in MovieDetailsContainer useFocusEffect()
  return <MovieDetailsContainer movieId={parseInt(showIdHome, 10)} />;
};

export default MovieDetailHome;
