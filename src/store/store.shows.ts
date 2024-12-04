import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results, ProviderInfo } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import { ImageColors } from "@/utils/color.utils";
import { reverse, sortBy, unionBy } from "lodash";
import useSettingsStore from "./store.settings";
import { useEffect, useState } from "react";

//!!
const addShowAsync =
  (
    set: (
      partial:
        | MovieStore
        | Partial<MovieStore>
        | ((state: MovieStore) => MovieStore | Partial<MovieStore>),
      replace?: boolean | undefined
    ) => void,
    get: () => MovieStore
  ) =>
  async (show: movieSearchByTitle_Results) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const showExists = doesShowExist(
          get().shows.map((el) => el.id),
          show.id
        );

        // If the show already exists or lacks an ID, resolve immediately.
        if (showExists || !show.id) {
          resolve();
        }

        const newShow = {
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

        // Simulate delay for background processes
        // await new Promise((resolve) => setTimeout(resolve, 5000));

        // Trigger the event bus actions
        eventBus.publish("TAG_SEARCH_RESULTS");
        eventBus.publish("GENERATE_GENRES_ARRAY");
        eventBus.publish("UPDATE_SHOW_PROVIDERS", show.id);
        eventBus.publish("GET_SHOW_COLORS", newShow.id, newShow?.posterURL);
        console.log("COLORS DONE");
        requestAnimationFrame(() => resolve());
      } catch (error) {
        reject(error);
      }
    });
  };
//!!!

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
  pos: number;
};

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: Tag[];
  genreArray: string[];
  // Updated with on the providers stored on shows, updated via "UPDATE_SHOW_PROVIDERS" event bus call.
  streamingProviders: ProviderInfo[];
  actions: {
    addShow: (show: movieSearchByTitle_Results) => Promise<void>;
    updateShow: (id: number, updatedShow: Partial<ShowItemType>) => void;
    updateShowTags: (id: number, tagId: string, action: "add" | "remove") => void;
    updateStreamingProviders: (newProviders: ProviderInfo[] | undefined) => void;
    removeShow: (id: number) => Promise<void>;
    getShowById: (id: number) => ShowItemType | undefined;
    tagAdd: (tag: string) => void;
    tagRemove: (tagId: string) => void;
    tagEdit: (tagId: string, newTagName: string) => void;
    tagUpdateOrder: (tags: Tag[]) => void;
    getShowsTags: (showId: number | undefined) => Pick<Tag, "id" | "name">[] | undefined;
    clearStore: () => void;
  };
}

const movieInitialState = {
  shows: [],
  tagArray: [],
  genreArray: [],
  streamingProviders: [],
};
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      ...movieInitialState,
      actions: {
        //~ ---------------------------------
        //~ NEW addShow
        addShow: addShowAsync(set, get),
        //~ ---------------------------------
        //~ OLD addShow
        // addShow: async (show) => {
        //   const showExists = doesShowExist(
        //     get().shows.map((el) => el.id),
        //     show.id
        //   );
        //   // If movie exists do nothing
        //   if (showExists || !show.id) return;
        //   new Promise((resolve) => resolve("done"));
        //   const newShow: ShowItemType = {
        //     id: show.id,
        //     title: show.title,
        //     posterURL: show?.posterURL,
        //     backdropURL: show?.backdropURL,
        //     releaseDateEpoch: show?.releaseDate?.epoch || 0,
        //     dateAddedEpoch: Date.now(),
        //     genres: show?.genres,
        //     rating: 0,
        //     tags: [],
        //     existsInSaved: true,
        //     streaming: {
        //       dateAddedEpoch: Date.now(),
        //       providers: [],
        //     },
        //   };
        //   set((state) => ({ shows: [...state.shows, newShow] }));
        //   requestAnimationFrame(() => {
        //     eventBus.publish("TAG_SEARCH_RESULTS");
        //     eventBus.publish("GENERATE_GENRES_ARRAY");
        //     eventBus.publish("UPDATE_SHOW_PROVIDERS", show.id);
        //   });
        // },
        //~ ---------------------------------
        //~ updateShow
        updateShow: (id, updatedShow) => {
          // NOTE: only == in case string insted of number is passed in as id
          set((state) => ({
            shows: state.shows.map((el) => (el.id == id ? { ...el, ...updatedShow } : el)),
          }));
        },
        //~ ---------------------------------
        //~ updateShowTags
        updateShowTags: (id, tagId, action) => {
          const allShows = [...get().shows];
          const currShow = allShows.find((show) => show.id === id);
          if (!currShow) return;

          const showTags = currShow?.tags || [];
          let newShowTags = [];
          if (action === "remove") {
            newShowTags = showTags.filter((tag) => tag !== tagId);
          } else {
            newShowTags = [...new Set([...showTags, tagId])];
          }
          currShow.tags = newShowTags;
          set({ shows: allShows });
        },
        //~ ---------------------------------
        //~ removeShow
        removeShow: async (id) => {
          requestAnimationFrame(() =>
            set((state) => ({
              shows: state.shows.filter((m) => m.id !== id),
            }))
          );
        },
        //~ ---------------------------------
        //~ getShowById
        getShowById: (id) => {
          const show = get().shows.find((el) => el.id === id);

          return show;
        },
        //~ ---------------------------------
        //~ updateStreamingProviders
        updateStreamingProviders: (newProviders) => {
          if (!newProviders) return;
          // merge new providers
          const currProviders = get().streamingProviders;
          const mergedProviders = unionBy(currProviders, newProviders, "providerId");

          set({ streamingProviders: mergedProviders });
        },
        //~ ---------------------------------
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
          const newTags = [
            ...currTags,
            { id, name: tag, dateAdded: Date.now(), pos: currTags.length },
          ];
          console.log("NEW Tags", newTags);
          set({ tagArray: newTags });
        },
        //~ ---------------------------------
        //~ tagRemove
        tagRemove: (tagId) => {
          const currTags = get().tagArray;
          const newTags = currTags.filter((currTag) => currTag.id !== tagId);
          set({ tagArray: newTags });
        },
        //~ ---------------------------------
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
        //~ ---------------------------------
        //~ tagUpdateOrder
        tagUpdateOrder: (tags: Tag[]) => {
          set({ tagArray: tags });
        },
        //~ ---------------------------------
        //~ getShowTags
        getShowsTags: (showId) => {
          if (!showId) return;
          const showTags = get().actions.getShowById(showId)?.tags;
          if (!showTags) return;
          const tags = get().tagArray;
          return showTags
            .map((showTag) => {
              const tagInfo = tags.find((el) => el.id === showTag);
              if (!tagInfo) return;
              return {
                id: tagInfo.id,
                name: tagInfo.name,
              };
            })
            .filter((el): el is Pick<Tag, "id" | "name"> => el !== null && el !== undefined);
        },
        //~ ---------------------------------
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
    updateShow(movieId, { favorited: isFavorited ? undefined : Date.now() });
  };
  const actions = { ...useMovieStore((state) => state.actions), toggleWatched, toggleFavorited };
  // return useMovieStore((state) => state.actions);
  return actions;
};

export const useGetAppliedTags = (showId: number | undefined) => {
  const { getShowsTags } = useMovieActions();
  const movies = useMovieStore((state) => state.shows);
  const [showTags, setShowTags] = useState<Pick<Tag, "id" | "name">[] | undefined>();
  useEffect(() => {
    const appliedTags = getShowsTags(showId);
    setShowTags(appliedTags);
  }, [showId, movies]);
  return showTags;
};
//~~ ------------------------------------------------------------
//~~ useMovies
//~~  Returns the movies to show on the main screen based on the settings
//~~ ------------------------------------------------------------
export const useMovies = () => {
  const {
    filterIsFavorited,
    filterIsWatched,
    includeTags,
    excludeTags,
    includeGenres,
    excludeGenres,
  } = useSettingsStore((state) => state.filterCriteria);
  const movies = useMovieStore((state) => state.shows);

  let filteredMovies: ShowItemType[] = [];
  // Loop through each saved movie and see if it meets criteria to be shown
  for (const movie of movies) {
    // if looking for watched movies, exclude if not watched, otherwise we don't case
    if (filterIsWatched !== "off") {
      if (
        (filterIsWatched === "include" && !movie?.watched) ||
        (filterIsWatched === "exclude" && movie?.watched)
      ) {
        continue;
      }
    }
    // favorited?
    if (filterIsFavorited !== "off") {
      if (
        (filterIsFavorited === "include" && !movie?.favorited) ||
        (filterIsFavorited === "exclude" && movie?.favorited)
      ) {
        continue;
      }
    }

    // Include Tags
    if (Array.isArray(includeTags) && includeTags?.length > 0) {
      // EVERY includeTag is present in the movie's tags
      if (!includeTags.every((tag) => movie.tags.includes(tag))) {
        continue;
      }
    }
    // Exclude Tags
    if (Array.isArray(excludeTags) && excludeTags?.length > 0) {
      // EVERY excludeTag is present in the movie's tags
      if (excludeTags.some((tag) => movie.tags.includes(tag))) {
        continue;
      }
    }

    // Genres
    if (Array.isArray(includeGenres) && includeGenres?.length > 0) {
      if (!includeGenres.every((genre) => movie.genres.includes(genre))) {
        continue;
      }
    }
    // Exclude Genres
    if (Array.isArray(excludeGenres) && excludeGenres?.length > 0) {
      // EVERY excludeTag is present in the movie's tags
      if (excludeGenres.some((genre) => movie.genres.includes(genre))) {
        continue;
      }
    }
    // if we make it here, then add the movie to our filtered list
    filteredMovies.push(movie);
  }

  // sort
  filteredMovies = reverse(sortBy(filteredMovies, "dateAddedEpoch"));
  return filteredMovies;
};

//-- UTILS
const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

export const updateTagState = (tags: Tag[], appliedTagIds: string[]) => {
  // Create a Set for fast lookups of applied tags
  const appliedTagSet = new Set(appliedTagIds);

  return tags.map((tag) => ({
    ...tag,
    applied: appliedTagSet.has(tag.id),
  }));
};

export default useMovieStore;
