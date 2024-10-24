import { WatchProvider } from "./../../node_modules/@markmccoid/tmdb_api/types/APICurated/API_TV.d";
import useMovieStore from "./store.shows";
import {
  movieGetDetails,
  movieDetails_typedef,
  movieGetWatchProviders,
  ProviderInfo,
  movieGetRecommendations,
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

//~~ --------------------------------------------------------------------------------
//~ useMovieWatchProviders - watch providers for a given movie ID
//~  Currently ONLY US region supported
//~~ --------------------------------------------------------------------------------
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

//~~ --------------------------------------------------------------------------------
//~ Get Movie Recommendations
//~~ --------------------------------------------------------------------------------
//! Type will be available in tmdb_api v3.03
type movieRecommendationsResults = {
  id: number;
  title: string;
  releaseDate: { date: Date; epoch: number; formatted: string };
  overview: string;
  posterURL: string;
  backdropURL: string;
  genres: string[];
  popularity: number;
  voteAverage: number;
  voteCount: number;
};
export const useMovieRecommendations = (movieId: number) => {
  return useQuery({
    queryKey: ["movierecommendations", movieId],
    queryFn: async () => {
      const resp = await movieGetRecommendations(movieId);
      return resp.data.results as movieRecommendationsResults[];
    },
  });
};
