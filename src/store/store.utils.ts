import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";

export const tagSavedMovies = (
  searchResults: movieSearchByTitle_Results[],
  savedMovies: movieSearchByTitle_Results[]
) => {
  return searchResults.map((movie) => ({
    ...movie,
    existsInSaved: savedMovies.some((savedMovie) => savedMovie.id === movie.id),
  }));
};
