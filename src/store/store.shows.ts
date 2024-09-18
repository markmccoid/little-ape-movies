import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import dayjs from "dayjs";

export type ShowItemType = {
  id: number;
  title: string;
  posterURL?: string;
  backdropURL?: string;
  releaseDateEpoch: number;
  dateAddedEpoch: number; // milliseconds elapsed since January 1, 1970
  genres: string[];
  rating: number;
  tags: string[];
  // Add other movie properties
};

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: string[];
  actions: {
    addShow: (show: movieSearchByTitle_Results) => void;
    updateShow: (id: number, updatedShow: Partial<movieSearchByTitle_Results>) => void;
    removeShow: (id: number) => void;
    getShowById: (id: number) => ShowItemType | undefined;
    clearStore: () => void;
  };
}
console.log("Movie Store Loaded");
const movieInitialState = {
  shows: [],
  tagArray: ["Watched", "Favorite"],
};
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      ...movieInitialState,
      actions: {
        addShow: (show) => {
          const showExists = doesShowExist(
            get().shows.map((el) => el.id),
            show.id
          );
          // If movie exists do nothing
          if (showExists) return;

          const newShow: ShowItemType = {
            id: show.id,
            title: show.title,
            posterURL: show.posterURL,
            backdropURL: show.backdropURL,
            releaseDateEpoch: show.releaseDate.epoch,
            dateAddedEpoch: Date.now(),
            genres: show?.genres,
            rating: 0,
            tags: [],
          };
          set((state) => ({ shows: [...state.shows, newShow] }));
          eventBus.publish("TAG_SEARCH_RESULTS");
        },
        updateShow: (id, updatedShow) =>
          set((state) => ({
            shows: state.shows.map((m) => (m.id === id ? { ...m, ...updatedShow } : m)),
          })),
        removeShow: (id) => {
          set((state) => ({
            shows: state.shows.filter((m) => m.id !== id),
          }));
          eventBus.publish("TAG_SEARCH_RESULTS");
        },
        getShowById: (id) => get().shows.find((el) => el.id === id),
        clearStore: () => set({ shows: [] }),
      },
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({ shows: state.shows }),
      onRehydrateStorage: (state) => {
        console.log("Rehydrating", state.shows.length);
      },
    }
  )
);

const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

export default useMovieStore;
