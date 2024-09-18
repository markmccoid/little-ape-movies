import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { create } from "zustand";
import useMovieStore from "./store.shows";
import { eventBus } from "./eventBus";
import { tagSavedMovies } from "./store.utils";

export type MovieSearchResults = movieSearchByTitle_Results & {
  existsInSaved: boolean;
};

type SearchStore = {
  results: MovieSearchResults[];
  searchVal: string | undefined;
  currentPage: number;
  lastProcessedPage: number;
  totalPages: number;
  actions: {
    setSearch: (searchVal: string | undefined) => void;
    setResults: (results: MovieSearchResults[], concatResults?: boolean) => void;

    setCurrentPage: (currentPage: number) => void;
    setLastProcessedPage: (lastProcessedPage: number) => void;
    setNextPage: () => void;
    setTotalPages: (totalPages: number) => void;
  };
};
const searchInitialState = {
  results: [],
  searchVal: undefined,
  currentPage: 1,
  lastProcessedPage: 0,
  totalPages: 1,
};
export const useSearchStore = create<SearchStore>((set, get) => ({
  results: [],
  searchVal: undefined,
  currentPage: 1,
  lastProcessedPage: 0,
  totalPages: 1,
  // This is always the initial state of the search so we must reset our values back to defaults
  actions: {
    setSearch: (searchVal) =>
      set({
        // results: [],
        searchVal,
        currentPage: 1,
        lastProcessedPage: 0,
        totalPages: 1,
      }),
    // setSearch: ({ searchVal, currentPage }) => set({ searchVal, currentPage }),
    setResults: (results, concatResults = false) => {
      const newResults = concatResults ? [...get().results, ...results] : results;
      set({ results: newResults });
      eventBus.publish("TAG_SEARCH_RESULTS");
    },

    setCurrentPage: (currentPage) => set({ currentPage }),
    setLastProcessedPage: (lastProcessedPage) => set({ lastProcessedPage }),
    setNextPage: () => set({ currentPage: get().currentPage + 1 }),
    setTotalPages: (totalPages) => set({ totalPages }),
  },
}));

//~~ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//~~ Subscribe to TAG_SEARCH_RESULTS
//~~ When search results are returned, we must update their
//~~ existsInSaved key so we can display if they are already
//~~ saved in our movie list.
//~~ This is called
//~~  - New search results are shown
//~~  - A movie is added to saved
//~~  - A movie is removed from saved
//~~ =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
eventBus.subscribe("TAG_SEARCH_RESULTS", () => {
  const savedMovies = useMovieStore.getState().shows;
  useSearchStore.setState((state) => ({
    results: tagSavedMovies(state.results, savedMovies),
  }));
});

eventBus.subscribe("CLEAR_SEARCH_STORES", () => {
  console.log("Clearing search state");
  useSearchStore.setState({ ...searchInitialState });
});
