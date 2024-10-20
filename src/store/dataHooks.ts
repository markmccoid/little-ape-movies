import { WatchProvider } from "./../../node_modules/@markmccoid/tmdb_api/types/APICurated/API_TV.d";
import useMovieStore from "./store.shows";
import {
  movieGetDetails,
  movieDetails_typedef,
  movieGetWatchProviders,
  ProviderInfo,
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
//~  Currently ONLY US region supported
//~ --------------------------------------------------------------------------------
export type WatchProviderOnly = {
  type: "stream" | "rent" | "buy" | "justWatchLink";
  title: string;
  providers: ProviderInfo[] | undefined;
};
export const useMovieWatchProviders = (movieId: number, region: string = "US") => {
  const fetchMovieWatchProviders = async () => {
    const tempData = await movieGetWatchProviders(movieId.toString(), [region]);
    return tempData.data.results.US;
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["watchProviders", movieId],
    queryFn: fetchMovieWatchProviders,
  });

  const watchProviders: WatchProviderOnly[] = [
    { type: "stream", title: "Stream", providers: data?.stream },
    { type: "rent", title: "Rent", providers: data?.rent },
    { type: "buy", title: "Buy", providers: data?.buy },
  ];
  return { watchProviders, justWatchLink: data?.justWatchLink, isLoading, ...rest };
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
