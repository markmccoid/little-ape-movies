import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { MovieSearchResults } from "./store.search";
import { ShowItemType } from "./store.shows";

export const tagSavedMovies = (
  searchResults: movieSearchByTitle_Results[],
  savedMovies: ShowItemType[]
): MovieSearchResults[] => {
  return searchResults.map((movie) => ({
    ...movie,
    existsInSaved: savedMovies.some((savedMovie) => savedMovie.id === movie.id),
  }));
};
