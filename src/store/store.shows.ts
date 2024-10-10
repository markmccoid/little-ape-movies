import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import { getImageColors, ImageColors } from "@/utils/color.utils";

export type ShowItemType = {
  id: number;
  title: string;
  posterURL?: string;
  posterColors?: ImageColors;
  backdropURL?: string;
  releaseDateEpoch: number;
  dateAddedEpoch: number; // milliseconds elapsed since January 1, 1970
  genres: string[]; // Genres as strings
  rating: number;
  tags: string[];
  existsInSaved: boolean;
  // Add other movie properties
};

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: string[];
  actions: {
    addShow: (show: movieSearchByTitle_Results) => void;
    updateShow: (id: number, updatedShow: Partial<ShowItemType>) => void;
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
          if (showExists || !show.id) return;

          const newShow: ShowItemType = {
            id: show.id,
            title: show.title,
            posterURL: show?.posterURL,
            backdropURL: show?.backdropURL,
            releaseDateEpoch: show?.releaseDate?.epoch || 0,
            dateAddedEpoch: Date.now(),
            genres: show?.genres,
            rating: 0,
            tags: [],
            existsInSaved: true,
          };
          set((state) => ({ shows: [...state.shows, newShow] }));
          eventBus.publish("TAG_SEARCH_RESULTS");
          // console.log("Calling GET COLORS");
          eventBus.publish("GET_SHOW_COLORS", newShow.id, newShow?.posterURL);
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
        getShowById: (id) => {
          const show = get().shows.find((el) => el.id === id);

          return show;
        },
        clearStore: () => set({ shows: [] }),
      },
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({ shows: state.shows }),
      onRehydrateStorage: (state) => {
        // console.log("Rehydrating", state.shows.length);
      },
    }
  )
);

export const useMovieActions = () => {
  return useMovieStore((state) => state.actions);
};

//-- UTILS
const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

//-- Subscribe
eventBus.subscribe("GET_SHOW_COLORS", async (movieId: number, posterURL) => {
  // console.log("EVENT BUS", movieId, posterURL)
  const imageColors = await getImageColors(posterURL);
  // console.log("IMAGE COL gotten");
  useMovieStore.getState().actions.updateShow(movieId, { posterColors: imageColors });
});
export default useMovieStore;
