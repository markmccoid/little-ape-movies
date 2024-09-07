import { useQuery } from "@tanstack/react-query";
import { getAuthedItem, getAuthedStorage, setAuthedItem } from "./localStorage-authed";
import { useState } from "react";
import { useMMKVString } from "react-native-mmkv";

export const useMovieData = () => {
  const storage = getAuthedStorage();
  // const currFilters = getAuthedItem("filter") || { tags: [] };
  const test = getAuthedItem("test");
  console.log("TEST", test);
  const [filter] = useMMKVString("filter", storage);
  const currFilters = JSON.parse(filter) || { tags: [] };
  console.log("CURR FILE", currFilters?.tags);
  const { isLoading, isError, data } = useQuery({
    queryKey: ["movies", currFilters?.tags],
    queryFn: async () => {
      const movies = getAuthedItem("movies");
      // if (!jsonMovies) return [];
      // const movies = JSON.parse(jsonMovies);
      return movies;
    },
  });
  if (!data) return [];
  let finalMovies = [];

  for (const movie of data) {
    console.log("TAGS", movie.tags, currFilters.tags);
    if (!currFilters?.tags || currFilters?.tags.length === 0) {
      finalMovies.push(movie);
      continue;
    }
    if (movie.tags?.some((el) => currFilters?.tags?.includes(el))) {
      finalMovies.push(movie);
    }
  }
  console.log("ISLOADING", isLoading, isError);
  console.log("Dataa", data);
  return finalMovies;
};

export const updateTagFilter = (tag: string, action: "add" | "remove") => {
  const currFilters = getAuthedItem("filter");
  const currTags = currFilters?.tags || [];

  let newTags: string[] = [];
  if (action === "add") {
    newTags = [...currTags, tag];
  } else if (action === "remove") {
    newTags = currTags.filter((el) => el !== tag);
  }
  console.log("CURR FILTERS", newTags);
  setAuthedItem("filter", JSON.stringify({ ...currFilters, tags: newTags }));
};
