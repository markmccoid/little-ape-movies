import useMovieStore from "./store.shows";
import { movieGetDetails } from "@markmccoid/tmdb_api";
import { useQuery } from "@tanstack/react-query";
import { add } from "lodash";
import { useEffect, useState } from "react";

export const useMovieDetailData = (movieId: number) => {
  // console.log("StoredMovie", storedMovie.existsInSaved, storedMovie.id);
  const fetchAdditionalMovieData = async (id: number) => {
    const response = await movieGetDetails(id);
    // console.log("RESPONSE", response);
    return response.data;
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

//!!
export const useMovieData = (movieId: number) => {
  console.log("Calling useMovieData");
  const getMovieById = useMovieStore((state) => state.actions.getShowById);
  // Replace with your actual selector
  // const storedMovieTemp = getMovieById(movieId);
  const storedMovies = useMovieStore((state) => state.shows);
  const storedMovieTemp = storedMovies.find((el) => el.id === movieId);
  console.log("StoredMovieTemp", storedMovieTemp);
  const storedMovie = storedMovieTemp
    ? { ...storedMovieTemp, existsInSaved: true }
    : { existsInSaved: false };
  const existsInSaved = storedMovieTemp ? true : false;
  const [finalData, setFinalData] = useState(storedMovie);

  // console.log("StoredMovie", storedMovie.existsInSaved, storedMovie.id);
  const fetchAdditionalMovieData = async (id: number) => {
    const response = await movieGetDetails(id);
    // console.log("RESPONSE", response);
    return response.data;
  };

  const {
    data: additionalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchAdditionalMovieData(movieId),
    enabled: !!movieId, // Only run query if movieId exists
    // initialData: storedMovie, // Initial data from Zustand
  });

  useEffect(() => {
    console.log("IN useMovieData Hook");
    const finalData = { ...storedMovie, ...additionalData };
    setFinalData(finalData);
  }, [additionalData, storedMovieTemp]);
  // console.log("FINAL DATA", finalData);
  return { data: finalData, isLoading, error, existsInSaved };
};

// import { useQuery } from "@tanstack/react-query";
// import { getAuthedItem, getAuthedStorage, setAuthedItem } from "./dataAccess/localStorage-authed";
// import { useState } from "react";
// import { useMMKVString } from "react-native-mmkv";

// export const useMovieData = () => {
//   const storage = getAuthedStorage();
//   // const currFilters = getAuthedItem("filter") || { tags: [] };
//   const test = getAuthedItem("test");
//   console.log("TEST", test);
//   const [filter] = useMMKVString("filter", storage);
//   const currFilters = JSON.parse(filter) || { tags: [] };
//   console.log("CURR FILE", currFilters?.tags);
//   const { isLoading, isError, data } = useQuery({
//     queryKey: ["movies", currFilters?.tags],
//     queryFn: async () => {
//       const movies = getAuthedItem("movies");
//       // if (!jsonMovies) return [];
//       // const movies = JSON.parse(jsonMovies);
//       return movies;
//     },
//   });
//   if (!data) return [];
//   let finalMovies = [];

//   for (const movie of data) {
//     console.log("TAGS", movie.tags, currFilters.tags);
//     if (!currFilters?.tags || currFilters?.tags.length === 0) {
//       finalMovies.push(movie);
//       continue;
//     }
//     if (movie.tags?.some((el) => currFilters?.tags?.includes(el))) {
//       finalMovies.push(movie);
//     }
//   }
//   console.log("ISLOADING", isLoading, isError);
//   console.log("Dataa", data);
//   return finalMovies;
// };

// export const updateTagFilter = (tag: string, action: "add" | "remove") => {
//   const currFilters = getAuthedItem("filter");
//   const currTags = currFilters?.tags || [];

//   let newTags: string[] = [];
//   if (action === "add") {
//     newTags = [...currTags, tag];
//   } else if (action === "remove") {
//     newTags = currTags.filter((el) => el !== tag);
//   }
//   console.log("CURR FILTERS", newTags);
//   setAuthedItem("filter", JSON.stringify({ ...currFilters, tags: newTags }));
// };
