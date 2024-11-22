import useMovieStore from "./store.shows";
import {
  movieGetDetails,
  movieDetails_typedef,
  movieGetWatchProviders,
  ProviderInfo,
  movieGetRecommendations,
  movieGetVideos,
  movieGetCredits,
} from "@markmccoid/tmdb_api";
import { useQuery } from "@tanstack/react-query";
import { reverse, sortBy } from "lodash";
import { useEffect, useState } from "react";
import { tagSavedMovies } from "./store.utils";
import axios from "axios";

//~ --------------------------------------------------------------------------------
//~ useOMDBData HELPERS
//~ --------------------------------------------------------------------------------
export type OMDBData = {
  rated?: string;
  imdbRating?: string;
  imdbVotes?: string;
  rottenTomatoesScore?: string;
  rottenTomatoesRating?: string;
  omdbPosterURL?: string;
  boxOffice?: string;
  omdbRunTime?: string;
  metascore?: string;
};
export type MovieDetails = movieDetails_typedef["data"] & OMDBData;
type OMDBMovie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string; // ex: "Action, Comedy"
  Director: string;
  Writer: string; // ex: "Etan Cohen, Macon Blair"
  Actors: string; // ex: "Josh Brolin, Peter Dinklage, Taylour Paige"
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  // Source - value
  // "Rotten Tomatoes" - "94%"
  // "Internet Movie Database" = "8.4/10"
  // "Metacritic" - "84/100"
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string; // "5.1"
  imdbVotes: string; // number of votes making up rating
  imdbID: string;
  Type: string; // movie, series, episode
  DVD: string;
  BoxOffice: string; // "$23,278,931"
  Production: string;
  Website: string;
  Response: string;
};

const getOMDBData = async (imdbId: string) => {
  if (!imdbId) return undefined;
  try {
    const response = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=c0247b61`);
    const omdbData = response.data as OMDBMovie;

    if (omdbData) {
      const rottenValue = omdbData?.Ratings.find((el) => el.Source === "Rotten Tomatoes")?.Value;
      const metacritic = omdbData?.Ratings.find((el) => el.Source === "Metacritic")?.Value;
      let rottenRating = undefined;
      if (rottenValue) {
        rottenRating = parseInt(rottenValue?.slice(0, 1)) < 6 ? "Rotten" : "Fresh";
      }
      const omdbInfo = {
        rated: omdbData?.Rated,
        imdbRating: omdbData?.imdbRating,
        imdbVotes: omdbData?.imdbVotes,
        rottenTomatoesScore: rottenValue,
        rottenTomatoesRating: rottenRating,
        omdbPosterURL: omdbData?.Poster,
        boxOffice: omdbData?.BoxOffice,
        omdbRunTime: omdbData?.Runtime,
        metascore: metacritic ? metacritic.slice(0, metacritic.indexOf("/")) : metacritic,
      };
      return omdbInfo;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return undefined;
  }
};

//~~ --------------------------------------------------------------------------------
//~ useOMDBData - Movie data from the OMDB API
//~~ --------------------------------------------------------------------------------
export const useOMDBData = (imdbID: string | undefined) => {
  return useQuery({
    queryKey: ["omdbdata", imdbID],
    queryFn: () => getOMDBData(imdbID!),
    enabled: !!imdbID, // Only run query if movieId exists
  });
};

//~~ --------------------------------------------------------------------------------
//~ useMovieDetailData - Base movie detail data
//~~ --------------------------------------------------------------------------------
export const useMovieDetailData = (movieId: number) => {
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
  const fetchAdditionalMovieData = async (id: number) => {
    const response = await movieGetDetails(id);
    return response.data as MovieDetails; // Return combined data
  };
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
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["movierecommendations", movieId],
    queryFn: async () => {
      const resp = await movieGetRecommendations(movieId);
      return resp.data.results as movieRecommendationsResults[];
    },
    staleTime: 600000,
  });

  // Tag the data
  const finalData = (data || []).map((movie) => ({
    ...movie,
    existsInSaved: useMovieStore.getState().shows.some((savedMovie) => savedMovie.id === movie.id),
  }));
  return { data: finalData, isLoading, ...rest };
};

//~~ --------------------------------------------------------------------------------
//~ Get Movie Videos
//~~ --------------------------------------------------------------------------------
export const useMovieVideos = (movieId: number) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["movievideos", movieId],
    queryFn: async () => {
      const resp = await movieGetVideos(movieId);
      return resp.data;
    },
    staleTime: 600000,
  });

  // Want trailers to show up first, so sort and then reverse
  const finalData = reverse(sortBy(data, ["type"]));
  return { data: finalData, isLoading, ...rest };
};
//~~ --------------------------------------------------------------------------------
//~ Get Movie Cast
//~~ --------------------------------------------------------------------------------
export const useMovieCast = (movieId: number | undefined) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["moviecast", movieId],
    queryFn: async () => {
      const resp = await movieGetCredits(movieId);
      return resp.data.cast;
    },
    staleTime: 600000,
  });

  return { data, isLoading, ...rest };
};
