import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results, ProviderInfo } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import { ImageColors } from "@/utils/color.utils";
import { unionBy } from "lodash";

type ShowStreamingProviders = {
  dateAddedEpoch: number;
  // Just store the providerId
  providers: number[];
};
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
  streaming: ShowStreamingProviders;
  watched?: number; // Epoch date number
  favorited?: number; // Epoch date number
  // Add other movie properties
};

type TagArray = {
  position: number;
  tagName: string;
};

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: TagArray[];
  streamingProviders: ProviderInfo[];
  actions: {
    addShow: (show: movieSearchByTitle_Results) => void;
    updateShow: (id: number, updatedShow: Partial<ShowItemType>) => void;
    updateShowTags: (id: number, tagId: string, action: "add" | "remove") => void;
    updateStreamingProviders: (newProviders: ProviderInfo[] | undefined) => void;
    removeShow: (id: number) => void;
    getShowById: (id: number) => ShowItemType | undefined;
    clearStore: () => void;
  };
}

const movieInitialState = {
  shows: [],
  tagArray: [{ position: 1, tagName: "Sample1" }],
  streamingProviders: [],
};
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      ...movieInitialState,
      actions: {
        //~ addShow
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
            streaming: {
              dateAddedEpoch: Date.now(),
              providers: [],
            },
          };
          set((state) => ({ shows: [...state.shows, newShow] }));

          eventBus.publish("UPDATE_SHOW_PROVIDERS", show.id);
          eventBus.publish("TAG_SEARCH_RESULTS");
          eventBus.publish("GET_SHOW_COLORS", newShow.id, newShow?.posterURL);
        },
        //~ updateShow
        updateShow: (id, updatedShow) => {
          set((state) => ({
            shows: state.shows.map((m) => (m.id === id ? { ...m, ...updatedShow } : m)),
          }));
          // console.log("UPDATE Show", updatedShow);
        },
        //~ updateShowTags
        updateShowTags: (id, tagId, action) => {
          const currShow = get().shows.find((show) => show.id === id);
          if (!currShow) return;

          const showTags = currShow?.tags || [];
          let newShowTags = [];
          if (action === "remove") {
            newShowTags = showTags.filter((tag) => tag !== tagId);
          } else {
            newShowTags = [...showTags, tagId];
          }
          console.log("NEWTAGS", newShowTags);
          currShow.tags = newShowTags;
          set((state) => ({ shows: [...state.shows, currShow] }));
        },
        //~ removeShow
        removeShow: (id) => {
          set((state) => ({
            shows: state.shows.filter((m) => m.id !== id),
          }));
          eventBus.publish("TAG_SEARCH_RESULTS");
        },
        //~ getShowById
        getShowById: (id) => {
          const show = get().shows.find((el) => el.id === id);

          return show;
        },
        //~ updateStreamingProviders
        updateStreamingProviders: (newProviders) => {
          if (!newProviders) return;
          // merge new providers
          const currProviders = get().streamingProviders;
          const mergedProviders = unionBy(currProviders, newProviders, "providerId");

          set({ streamingProviders: mergedProviders });
        },
        //~ clearStore
        clearStore: () => set({ shows: [] }),
      },
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({
        shows: state.shows,
        tagsArray: state.tagArray,
        streamingProviders: state.streamingProviders,
      }),
      onRehydrateStorage: (state) => {
        // console.log("Rehydrating", state.shows.length);
      },
    }
  )
);

export const useMovieActions = () => {
  const updateShow = useMovieStore((state) => state.actions.updateShow);
  // probably want to toggle
  const toggleWatched = (movieId: number) => {
    const isWatched = useMovieStore.getState().actions.getShowById(movieId)?.watched;
    updateShow(movieId, { watched: isWatched ? undefined : Date.now() });
  };
  const actions = { ...useMovieStore((state) => state.actions), toggleWatched };
  // return useMovieStore((state) => state.actions);
  return actions;
};

//-- UTILS
const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

// //-- Subscribe
// eventBus.subscribe("GET_SHOW_COLORS", async (movieId: number, posterURL) => {
//   // console.log("EVENT BUS", movieId, posterURL)
//   const imageColors = await getImageColors(posterURL);
//   // console.log("IMAGE COL gotten");
//   useMovieStore.getState().actions.updateShow(movieId, { posterColors: imageColors });
// });
export default useMovieStore;
