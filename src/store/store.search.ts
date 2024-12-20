import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { create } from "zustand";
import useMovieStore from "./store.shows";
import { eventBus } from "./eventBus";
import { tagSavedMovies } from "./store.utils";

export type MovieSearchResults = movieSearchByTitle_Results & {
  existsInSaved: boolean;
};
export type SearchType = "title" | "person";
type SearchStore = {
  searchVal: string | undefined;
  searchType: SearchType;
  actions: {
    setSearch: (searchVal: string | undefined) => void;
    setSearchType: (searchType: SearchType) => void;
  };
};
const searchInitialState = {
  searchVal: undefined,
  searchType: "title",
};
export const useSearchStore = create<SearchStore>((set, get) => ({
  searchVal: undefined,
  searchType: "title" as SearchType,
  actions: {
    setSearch: (searchVal) =>
      set({
        searchVal,
      }),
    setSearchType: (searchType) => {
      set({ searchType });
    },
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
// eventBus.subscribe("TAG_SEARCH_RESULTS", () => {
//   const savedMovies = useMovieStore.getState().shows;
//   useSearchStore.setState((state) => ({
//     results: tagSavedMovies(state.results, savedMovies),
//   }));
// });

eventBus.subscribe("CLEAR_SEARCH_STORES", () => {
  useSearchStore.setState({ ...searchInitialState });
});
