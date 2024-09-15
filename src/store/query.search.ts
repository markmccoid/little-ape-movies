import { movieSearchByTitle, movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSearchStore } from "@/store/store.search";
import useMovieStore from "./store.movie";

/**
 *
 * My thought is to have a hook that accepts a title(searchValue) and nextPage bool -> default "false"
 * If false, it will select page 1 and page 2
 * If true, we will look at a "nextPage" saved state to tell us what the next page is.
 * This means that this hook will be responsible for keeping track of the "state" of the data pull
 *  - It must know if this is a "new" query.  If so
 *    - clear old data and populate with first 2 pages of movie data
 *  - If the searchValue has not changes and the nextPage is true
 *    - keep the old data and add on the "next" page of data
 *    - once done update the "next" page number
 *
 *  - The "next" page updater MUST also look at the total pages so that we know when to "end" the query pulls
 */
export const useSearchResults = () => {
  const queryClient = useQueryClient();
  const searchVal = useSearchStore((state) => state.searchVal);
  const prevSearchVal = useRef<string | undefined>(undefined);
  const currentPage = useSearchStore((state) => state.currentPage);
  const lastProcessedPage = useSearchStore((state) => state.lastProcessedPage);
  const totalPages = useSearchStore((state) => state.totalPages);
  const actions = useSearchStore((state) => state.actions);

  //~~ USEQUERY Hook
  const { data, isLoading } = useQuery({
    queryKey: ["moviesearch", searchVal, currentPage],
    queryFn: async () => {
      if (!searchVal) return undefined;
      return movieSearchByTitle(searchVal, currentPage);
    },

    enabled: !!searchVal && !!(totalPages >= currentPage) && !!(lastProcessedPage < currentPage),
  });

  useEffect(() => {
    // Cancel previous query if a new searchVal is provided.
    console.log("Canceling query", prevSearchVal.current, searchVal);
    if (prevSearchVal?.current && prevSearchVal.current !== searchVal) {
      console.log("REAL CANC");
      queryClient.cancelQueries({ queryKey: ["moviesearch", prevSearchVal] });
    }
    prevSearchVal.current = searchVal;
  }, [searchVal, queryClient]);

  useEffect(() => {
    // if (totalPages > currentPage) return;
    if (isLoading) return;
    const newResults = data?.data?.results ?? [];
    const totalPages = data?.data?.totalPages ?? 0;
    actions.setTotalPages(totalPages);

    if (currentPage === 1) {
      actions.setResults(newResults);
      if (totalPages > 1) {
        actions.setLastProcessedPage(1);
        actions.setCurrentPage(2);
      }
    } else {
      if (lastProcessedPage < currentPage) {
        actions.setResults(newResults, true);
        actions.setLastProcessedPage(currentPage);
      }
    }
  }, [data, isLoading]);

  return { isLoading };

  /**
   * our useQuery will have a key of searchVal and currentPage so if either change, it triggers a refresh
   * We run the query with the values from criteria store
   * AFTER we check if current Page is === 1
   * IF so, then we replace criteriaStore results with results from query
   * IF NOT === 1 then we concate results to criteriaStore results
   *   This is our expectation that we are moving forward using the same searchvale
   * IF === 1 we ALSO update the currentPage to 2, causing another query so we get 40 results on first run
   *  -- Figure out order of IFs to check
   * We also need to check against the TOTAL pages so we don't keep querying if done with results.
   */
};

// const tagMovies = (movies) => {
//   const currMovieIds = useMovieStore.getState().movies.map((el) => el.id);
//   let taggedMovies = [];
//   for (const movie of movies) {
//     if (currMovieIds.includes(movie.id)) {
//       taggedMovies.push({ ...movie, existsInSaved: true });
//     } else {
//       taggedMovies.push({ ...movie, existsInSaved: false });
//     }
//   }
//   return taggedMovies;
// };
