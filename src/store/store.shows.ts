import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results, ProviderInfo } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import { ImageColors } from "@/utils/color.utils";
import { reverse, sortBy, unionBy } from "lodash";
import useSettingsStore from "./store.settings";

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

export type Tag = {
  id: string;
  name: string;
  dateAdded: number;
};

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: Tag[];
  // Updated with on the providers stored on shows, updated via "UPDATE_SHOW_PROVIDERS" event bus call.
  streamingProviders: ProviderInfo[];
  actions: {
    addShow: (show: movieSearchByTitle_Results) => void;
    updateShow: (id: number, updatedShow: Partial<ShowItemType>) => void;
    updateShowTags: (id: number, tagId: string, action: "add" | "remove") => void;
    updateStreamingProviders: (newProviders: ProviderInfo[] | undefined) => void;
    removeShow: (id: number) => void;
    getShowById: (id: number) => ShowItemType | undefined;
    tagAdd: (tag: string) => void;
    tagRemove: (tagId: string) => void;
    tagEdit: (tagId: string, newTagName: string) => void;
    tagUpdateOrder: (tags: Tag[]) => void;
    clearStore: () => void;
  };
}

const movieInitialState = {
  shows: [],
  tagArray: [],
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
        //~ tagAdd
        tagAdd: (tag) => {
          if (!tag || tag === "") return;
          const currTags = get().tagArray;
          // Make sure it doesn't exist
          const exists = currTags
            .map((currTag) => currTag.name.toLowerCase())
            .includes(tag.toLowerCase());
          if (exists) {
            throw new Error("duplicate");
          }
          // create new id
          const id = Date.now().toString(36);
          const newTags = [...currTags, { id, name: tag, dateAdded: Date.now() }];
          set({ tagArray: newTags });
        },
        //~ tagRemove
        tagRemove: (tagId) => {
          const currTags = get().tagArray;
          const newTags = currTags.filter((currTag) => currTag.id !== tagId);
          set({ tagArray: newTags });
        },
        //~ tagEdit
        tagEdit: (tagId, newTagName) => {
          if (!newTagName || newTagName === "") return;
          const currTags = [...get().tagArray];
          for (let currTag of currTags) {
            if (currTag.id === tagId) {
              currTag.name = newTagName;
              break;
            }
          }

          set({ tagArray: currTags });
          console.log("EDIT TAGS", get().tagArray);
        },
        //~ tagUpdateOrder
        tagUpdateOrder: (tags: Tag[]) => {
          set({ tagArray: tags });
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
        tagArray: state.tagArray,
        streamingProviders: state.streamingProviders,
      }),
      onRehydrateStorage: (state) => {
        // console.log("Rehydrating", state.shows.length);
      },
    }
  )
);

//~~ ------------------------------------------------------------
//~~ useMovieActions
//~~  actions defined on useMovieStore as well as custom actions
//~~ ------------------------------------------------------------
export const useMovieActions = () => {
  const updateShow = useMovieStore((state) => state.actions.updateShow);
  //~ toggleWatched
  const toggleWatched = (movieId: number) => {
    const isWatched = useMovieStore.getState().actions.getShowById(movieId)?.watched;
    updateShow(movieId, { watched: isWatched ? undefined : Date.now() });
  };
  //~ toggleFavorited
  const toggleFavorited = (movieId: number) => {
    const isFavorited = useMovieStore.getState().actions.getShowById(movieId)?.favorited;
    updateShow(movieId, { watched: isFavorited ? undefined : Date.now() });
  };
  const actions = { ...useMovieStore((state) => state.actions), toggleWatched, toggleFavorited };
  // return useMovieStore((state) => state.actions);
  return actions;
};

//~~ ------------------------------------------------------------
//~~ useMovies
//~~  Returns the movies to show on the main screen based on the settings
//~~ ------------------------------------------------------------
export const useMovies = () => {
  const { filterIsFavorited, filterIsWatched, tags } = useSettingsStore(
    (state) => state.filterCriteria
  );
  const movies = useMovieStore((state) => state.shows);

  let filteredMovies: ShowItemType[] = [];
  for (const movie of movies) {
    if (filterIsWatched) {
      if (movie?.watched) {
        filteredMovies.push(movie);
      }
    } else {
      filteredMovies.push(movie);
    }
  }

  // sort
  filteredMovies = reverse(sortBy(filteredMovies, "dateAddedEpoch"));
  return filteredMovies;
};

//-- UTILS
const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

export default useMovieStore;
