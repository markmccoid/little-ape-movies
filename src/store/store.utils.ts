import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import type { MovieSearchResults } from "./store.search";
import { getCurrentUser } from "./dataAccess/localStorage-users";
import { getSavedShowIds } from "./dataAccess/moviePersistence";

export const tagSavedMovies = (
  searchResults: movieSearchByTitle_Results[]
): MovieSearchResults[] => {
  const userId = getCurrentUser()?.id;
  const savedIds = userId ? getSavedShowIds(userId) : new Set<number>();
  return searchResults.map((movie) => ({
    ...movie,
    existsInSaved: savedIds.has(movie.id),
  }));
};
