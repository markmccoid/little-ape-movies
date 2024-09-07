import { DehydrateOptions } from "./../../node_modules/@tanstack/query-core/src/hydration";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./storageAdapter";

interface Movie {
  id: string;
  title: string;
  // Add other movie properties
}

interface MovieStore {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  removeMovie: (id: string) => void;
  getMovies: () => Movie[];
  clearStore: () => void;
}
console.log("Movie Store Loaded");
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) => set((state) => ({ movies: [...state.movies, movie] })),
      updateMovie: (id, updatedMovie) =>
        set((state) => ({
          movies: state.movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)),
        })),
      removeMovie: (id) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== id),
        })),
      getMovies: () => get().movies,
      clearStore: () => set({ movies: [] }),
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      onRehydrateStorage: (state) => {
        console.log("Rehydrating", state);
      },
    }
  )
);

export default useMovieStore;
