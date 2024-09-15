import { movieSearchByTitle } from "@markmccoid/tmdb_api";
import useSearchStore from "./store.search";
import { useQuery } from "@tanstack/react-query";
import React from "react";

let currentPage = 1;
//TODO - Need to implement the isNewQuery to reset currentPage
export const useSearchData = () => {
  const { type, value, isNewQuery, currentPage } = useSearchStore((state) => state.search);
  const { results, totalPages } = useSearchStore((state) => state.searchResults);
  // let page = currentPage;
  // if (isNewQuery) {
  //   page = 1;
  // }
  const { data, isLoading, isError, ...rest } = useQuery({
    queryKey: ["moviesearch", value, currentPage],
    queryFn: () => searchMovie(value, currentPage),
    staleTime: 500,
  });

  React.useEffect(() => {
    if (!isLoading && !isError && data) {
      const results = useSearchStore.getState().searchResults.results;
      useSearchStore.setState((state) => {
        state.searchResults.results = [...results, ...data?.data?.results] || [];
      });
    }
  }, [data, isLoading, isError]);

  return useSearchStore.getState().searchResults.results;
};

const searchMovie = async (value: string, currentPage: number) => {
  console.log("SearchValue", value);
  const data = await movieSearchByTitle(value, currentPage);
  console.log("data", data?.data?.results.length);
  return data;
};
