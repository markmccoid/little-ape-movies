import { DehydrateOptions } from "../../node_modules/@tanstack/query-core/src/hydration";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { useSearchStore } from "./store.search";
import { eventBus } from "./eventBus";

interface Movie {
  id: string;
  title: string;

  // Add other movie properties
}

export interface MovieStore {
  movies: movieSearchByTitle_Results[];
  actions: {
    addMovie: (movie: movieSearchByTitle_Results) => void;
    updateMovie: (id: number, updatedMovie: Partial<movieSearchByTitle_Results>) => void;
    removeMovie: (id: number) => void;
    getMovieById: (id: number) => movieSearchByTitle_Results | undefined;
    clearStore: () => void;
  };
}
console.log("Movie Store Loaded");
const movieInitialState = {
  movies: [],
};
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      ...movieInitialState,
      actions: {
        addMovie: (movie) => {
          if (
            !doesMovieExist(
              get().movies.map((el) => el.id),
              movie.id
            )
          ) {
            set((state) => ({ movies: [...state.movies, movie] }));
            eventBus.publish("TAG_SEARCH_RESULTS");
          }
        },
        updateMovie: (id, updatedMovie) =>
          set((state) => ({
            movies: state.movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)),
          })),
        removeMovie: (id) => {
          set((state) => ({
            movies: state.movies.filter((m) => m.id !== id),
          }));
          eventBus.publish("TAG_SEARCH_RESULTS");
        },
        getMovieById: (id) => get().movies.find((el) => el.id === id),
        clearStore: () => set({ movies: [] }),
      },
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({ movies: state.movies }),
      onRehydrateStorage: (state) => {
        console.log("Rehydrating", state.movies.length);
      },
    }
  )
);

const doesMovieExist = (allMovies: number[], movieToCheck: number) => {
  return allMovies.includes(movieToCheck);
};

export default useMovieStore;
