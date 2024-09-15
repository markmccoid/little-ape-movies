import { movieSearchByTitle_Results, movieSearchByTitle_typedef } from "@markmccoid/tmdb_api";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Define the store's state type
interface SearchState {
  search: {
    type: "title";
    value: string;
    isNewQuery: boolean;
    currentPage: number;
  };
  searchResults: {
    results: movieSearchByTitle_Results[];
    totalPages: number | undefined;
    currentPage: number;
  };
  actions: {
    setSearchValue: (value: string) => void;
    setIsNewQuery: (isNewBool: boolean) => void;
    setCurrentPage: (currentPage: number) => void;
  };
}

// Create the store
export const useSearchStore = create<SearchState>()(
  immer((set) => ({
    // Initial state
    search: {
      type: "title",
      value: "",
      isNewQuery: true,
      currentPage: 1,
    },
    searchResults: {
      results: [],
      totalPages: undefined,
      currentPage: 1,
    },
    actions: {
      // Action to set the searchText
      setSearchValue: (value) =>
        set((state) => {
          state.search.value = value;
        }),
      setIsNewQuery: (isNew) => {
        if (isNew) {
          set((state) => {
            state.search.currentPage = 1;
            state.search.isNewQuery = isNew;
          });
        } else {
          set((state) => {
            state.search.isNewQuery = isNew;
          });
        }
      },
      setCurrentPage: (currentPage) => {
        set((state) => {
          state.search.currentPage = currentPage;
        });
      },
    },
  }))
);

export default useSearchStore;
