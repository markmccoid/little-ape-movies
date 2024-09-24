import {
  movieDiscover,
  movieGetNowPlaying,
  movieGetPersonCredits,
  movieGetPopular,
  movieSearchByTitle,
  movieSearchByTitle_Results,
  SearchForPerson_Results,
  searchForPersonId,
  searchForPersonId_typedef,
} from "@markmccoid/tmdb_api";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MovieSearchResults, useSearchStore } from "@/store/store.search";
import React from "react";
import { tagSavedMovies } from "./store.utils";
import useMovieStore from "./store.shows";
import { eventBus } from "./eventBus";
import {
  InfiniteData,
  InfiniteQueryObserverResult,
  FetchNextPageOptions,
} from "@tanstack/react-query";

export type FetchNextPageFn<Data> = (
  options?: FetchNextPageOptions
) => Promise<InfiniteQueryObserverResult<InfiniteData<Data>, Error>>;

export const useTitleSearch = () => {
  const queryClient = useQueryClient();
  const searchVal = useSearchStore((state) => state.searchVal);
  const searchType = useSearchStore((state) => state.searchType);
  const [movies, setMovies] = useState<MovieSearchResults[]>([]);
  const moviesRef = useRef(movies);
  // const prevSearchVal = useRef<string | undefined>(undefined);
  // const currentPage = useSearchStore((state) => state.currentPage);
  // const lastProcessedPage = useSearchStore((state) => state.lastProcessedPage);
  // const totalPages = useSearchStore((state) => state.totalPages);
  const actions = useSearchStore((state) => state.actions);

  //~~ USEINFINITEQUERY TITLE Movie Search Value Hook
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ["moviesearch", searchVal],
    queryFn: async ({ pageParam }) => {
      if (!searchVal) {
        return movieGetNowPlaying(pageParam);
      }
      return movieSearchByTitle(searchVal, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage || lastPage?.data.totalPages === lastPage?.data.page) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => {
      if (!firstPage || firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    enabled: searchType === "title",
    // enabled: !!searchVal && !!(totalPages >= currentPage) && !!(lastProcessedPage < currentPage),
  });

  //!! Pub/Sub tagging of data
  useEffect(() => {
    const handleExternalEvent = () => {
      const taggedMovies = tagSavedMovies(moviesRef.current, useMovieStore.getState().shows);
      setMovies(taggedMovies);
    };
    // Subscribe to the Tag result event
    const unsubFunc = eventBus.subscribe("TAG_SEARCH_RESULTS", handleExternalEvent);
    return unsubFunc;
  }, []);

  //~~ Whenever we get new data we get the results and combine to a single array
  //~~ The infiniteQuery returns the data in separate pages keys on the data object.
  //~~ We have to run the .filter() to get rid of undefined values.
  useEffect(() => {
    const moviesHold =
      (data?.pages
        .flatMap((page) => page?.data.results)
        .filter((el) => el) as MovieSearchResults[]) || [];
    // Tag with existsInSaved key
    const taggedMovies = tagSavedMovies(moviesHold, useMovieStore.getState().shows);
    setMovies(taggedMovies);
    // Need to store a ref so it can be used in the eventBus callback
    moviesRef.current = taggedMovies;
  }, [data]);
  // Flatten Data
  // const moviesHold: MovieSearchResults[] = React.useMemo(() => {
  //   if (!data) return [];
  //   return data.pages
  //     .flatMap((page) => page?.data.results)
  //     .filter((el) => el) as MovieSearchResults[];
  // }, [data]);

  return { movies, isLoading, fetchNextPage };
};

export const usePersonSearch = () => {
  const searchVal = useSearchStore((state) => state.searchVal);
  const searchType = useSearchStore((state) => state.searchType);
  const [persons, setPersons] = useState<SearchForPerson_Results[]>([]);

  //~~ USEINFINITEQUERY Person Movie Search Value Hook
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ["personSearch", searchVal],
    queryFn: async ({ pageParam }) => {
      console.log("searchval person", searchVal);
      if (!searchVal) return undefined;
      return searchForPersonId(searchVal, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage || lastPage?.data.totalPages === lastPage?.data.page) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => {
      if (!firstPage || firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    enabled: searchType === "person",
    // enabled: !!searchVal && !!(totalPages >= currentPage) && !!(lastProcessedPage < currentPage),
  });

  //~~ Whenever we get new data we get the results and combine to a single array
  //~~ The infiniteQuery returns the data in separate pages keys on the data object.
  //~~ We have to run the .filter() to get rid of undefined values.
  useEffect(() => {
    const personHold =
      data?.pages
        .flatMap((page) => page?.data?.results || [])
        .filter((el) => el?.popularity > 0.01) || [];
    // console.log("PersonsHOLD", personHold);
    setPersons(personHold);
  }, [data]);

  return { persons, isLoading, fetchNextPage };
};

export const usePersonMovieSearch = (personId: number) => {
  // const searchVal = useSearchStore((state) => state.searchVal);
  // const searchType = useSearchStore((state) => state.searchType);
  const [movies, setMovies] = useState<MovieSearchResults[]>([]);
  const moviesRef = useRef(movies);

  //~~ USEQUERY TITLE Movie Search Value Hook
  const { data, isLoading } = useQuery({
    queryKey: ["personMovieSearch", personId],
    queryFn: async () => {
      if (!personId) return [];
      return movieGetPersonCredits(personId);
      // return movieDiscover({ cast: [personId], sortBy: "primary_release_date.desc" }, pageParam);
      // return movieSearchByTitle(searchVal, pageParam);
    },
    // enabled: searchType === "title",
  });

  //!! Pub/Sub tagging of data
  useEffect(() => {
    const handleExternalEvent = () => {
      const taggedMovies = tagSavedMovies(moviesRef.current, useMovieStore.getState().shows);
      setMovies(taggedMovies);
    };
    // Subscribe to the Tag result event
    const unsubFunc = eventBus.subscribe("TAG_SEARCH_RESULTS", handleExternalEvent);
    return unsubFunc;
  }, []);

  //~~ Whenever we get new data we get the results and combine to a single array
  //~~ The infiniteQuery returns the data in separate pages keys on the data object.
  //~~ We have to run the .filter() to get rid of undefined values.
  useEffect(() => {
    if (!data?.data?.cast) return;

    const castMovies = data?.data?.cast.map<MovieSearchResults>((member) => ({
      id: member.movieId,
      backdropURL: member.backdropURL,
      genres: member.genres,
      posterURL: member.posterURL,
      releaseDate: member.releaseDate,
      title: member.title,
      overview: member.overview,
      existsInSaved: false,
    }));
    // const crewMovies = data?.data?.cast.map<MovieSearchResults>(member => ({
    //   id: member.movieId,
    //   backdropURL: member.backdropURL,
    //   genres: member.genres,
    //   posterURL: member.posterURL,
    //   releaseDate: member.releaseDate,
    //   title: member.title,
    //   overview: member.overview,
    //   existsInSaved: false
    // }));

    // Tag with existsInSaved key
    const taggedMovies = tagSavedMovies(castMovies, useMovieStore.getState().shows);
    setMovies(taggedMovies);
    // Need to store a ref so it can be used in the eventBus callback
    moviesRef.current = taggedMovies;
  }, [data]);
  // Flatten Data
  // const moviesHold: MovieSearchResults[] = React.useMemo(() => {
  //   if (!data) return [];
  //   return data.pages
  //     .flatMap((page) => page?.data.results)
  //     .filter((el) => el) as MovieSearchResults[];
  // }, [data]);
  return { movies, isLoading };
};
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
export const useSearchResults__Depricated = () => {
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
    if (prevSearchVal?.current && prevSearchVal.current !== searchVal) {
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
