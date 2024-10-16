import useMovieStore from "./store.shows";
import {
  movieGetDetails,
  movieDetails_typedef,
  movieGetWatchProviders,
} from "@markmccoid/tmdb_api";
import { useQuery } from "@tanstack/react-query";
import { add } from "lodash";
import { useEffect, useState } from "react";

//~ --------------------------------------------------------------------------------
//~ useMovieDetails - Data from the movie/show details page
//~ --------------------------------------------------------------------------------
export type MovieDetails = movieDetails_typedef["data"];
export const useMovieDetailData = (movieId: number) => {
  // console.log("StoredMovie", storedMovie.existsInSaved, storedMovie.id);
  const fetchAdditionalMovieData = async (id: number) => {
    const response = await movieGetDetails(id);
    // console.log("RESPONSE", response);
    return response.data as MovieDetails;
  };

  const {
    data: movieDetails,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchAdditionalMovieData(movieId),
    enabled: !!movieId, // Only run query if movieId exists
    // initialData: storedMovie, // Initial data from Zustand
  });

  return { movieDetails, isLoading, ...rest };
};

//~ --------------------------------------------------------------------------------
//~ useMovieWatchProviders - watch providers for a given movie ID
//~ --------------------------------------------------------------------------------
export const useMovieWatchProviders = (movieId: number, region: string = "US") => {
  const fetchMovieWatchProviders = async () => {
    const tempData = await movieGetWatchProviders(movieId.toString(), [region]);
  };
  return { movieId, region };
};

//!!
// export const useMovieData = (movieId: number) => {
//   console.log("Calling useMovieData");
//   const getMovieById = useMovieStore((state) => state.actions.getShowById);
//   // Replace with your actual selector
//   // const storedMovieTemp = getMovieById(movieId);
//   const storedMovies = useMovieStore((state) => state.shows);
//   const storedMovieTemp = storedMovies.find((el) => el.id === movieId);
//   console.log("StoredMovieTemp", storedMovieTemp);
//   const storedMovie = storedMovieTemp
//     ? { ...storedMovieTemp, existsInSaved: true }
//     : { existsInSaved: false };
//   const existsInSaved = storedMovieTemp ? true : false;
//   const [finalData, setFinalData] = useState(storedMovie);

//   // console.log("StoredMovie", storedMovie.existsInSaved, storedMovie.id);
//   const fetchAdditionalMovieData = async (id: number) => {
//     const response = await movieGetDetails(id);
//     // console.log("RESPONSE", response);
//     return response.data;
//   };

//   const {
//     data: additionalData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["movie", movieId],
//     queryFn: () => fetchAdditionalMovieData(movieId),
//     enabled: !!movieId, // Only run query if movieId exists
//     // initialData: storedMovie, // Initial data from Zustand
//   });

//   useEffect(() => {
//     console.log("IN useMovieData Hook");
//     const finalData = { ...storedMovie, ...additionalData };
//     setFinalData(finalData);
//   }, [additionalData, storedMovieTemp]);
//   // console.log("FINAL DATA", finalData);
//   return { data: finalData, isLoading, error, existsInSaved };
// };
