import {
  getPersonDetails,
  movieDiscover,
  movieGetNowPlaying,
  movieGetPersonCredits,
  type moviePersonCredits_typedef,
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
  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
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

  //  !! Pub/Sub tagging of data
  useEffect(() => {
    const handleExternalEvent = () => {
      const taggedMovies = tagSavedMovies(moviesRef.current);
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
    const taggedMovies = tagSavedMovies(moviesHold);
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

  return { movies, isLoading, isError, fetchNextPage };
};

export const usePersonSearch = () => {
  const searchVal = useSearchStore((state) => state.searchVal);
  const searchType = useSearchStore((state) => state.searchType);
  const [persons, setPersons] = useState<SearchForPerson_Results[]>([]);

  //~~ USEINFINITEQUERY Person Movie Search Value Hook
  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ["personSearch", searchVal],
    queryFn: async ({ pageParam }) => {
      console.log("searchval person", searchVal);
      return searchForPersonId(searchVal ?? "", pageParam);
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
    enabled: searchType === "person" && !!searchVal,
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

  return { persons, isLoading, isError, fetchNextPage };
};

export const usePersonMovieSearch = (personId: number) => {
  // const searchVal = useSearchStore((state) => state.searchVal);
  // const searchType = useSearchStore((state) => state.searchType);
  const [movies, setMovies] = useState<MovieSearchResults[]>([]);
  const moviesRef = useRef(movies);

  //~~ USEQUERY TITLE Movie Search Value Hook
  const { data, isLoading, isError } = useQuery({
    queryKey: ["personMovieSearch", personId],
    queryFn: () => movieGetPersonCredits(personId),
    enabled: personId > 0,
    // enabled: searchType === "title",
  });

  //!! Pub/Sub tagging of data
  useEffect(() => {
    const handleExternalEvent = () => {
      const taggedMovies = tagSavedMovies(moviesRef.current);
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

    const castMovies = data.data.cast.map<MovieSearchResults>(
      (member: moviePersonCredits_typedef["data"]["cast"][number]) => ({
        id: member.movieId,
        backdropURL: member.backdropURL,
        genres: member.genres,
        posterURL: member.posterURL,
        releaseDate: member.releaseDate,
        title: member.title,
        overview: member.overview,
        existsInSaved: false,
      })
    );
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
    const taggedMovies = tagSavedMovies(castMovies);
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
  return { movies, isLoading, isError };
};

export const usePersonDetails = (personId: number) => {
  //~~ USEQUERY TITLE Movie Search Value Hook
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["personDetailsSearch", personId],
    queryFn: async () => {
      if (!personId) return {};
      return getPersonDetails(personId);
    },
  });

  return { data, isLoading, ...rest };
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
