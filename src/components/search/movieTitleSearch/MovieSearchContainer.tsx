import React from "react";
import { useTitleSearch } from "@/store/query.search";
import SearchContainer from "../SearchContainer";
import FetchNotice from "@/components/common/FetchNotice";

const MovieSearchContainer = () => {
  const { movies, isLoading, isError, fetchNextPage } = useTitleSearch();

  if (isError && movies.length === 0 && !isLoading) {
    return <FetchNotice message="Couldn't load movies." />;
  }

  return <SearchContainer movies={movies} fetchNextPage={fetchNextPage} />;
};

export default MovieSearchContainer;
