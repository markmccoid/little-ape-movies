import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { movieSearchByTitle_Results, ProviderInfo } from "@markmccoid/tmdb_api";
import { eventBus } from "./eventBus";
import { ImageColors } from "@/utils/color.utils";
import { filter, orderBy, reverse, sortBy, unionBy } from "lodash";
import useSettingsStore, { SortField } from "./store.settings";
import { useEffect, useState } from "react";
import { formatEpoch } from "@/utils/utils";

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
  rating: number; // User Rating
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

// When making changes using the ActionBar, we store them here until the user closes the action bar
// This keeps the movie list from rerending and resorting on every change.
type MovieId = number;
type ToggleOptions = "toggle" | "on" | "off";
export type PendingChanges = Record<
  MovieId,
  { watched?: ToggleOptions; favorited?: ToggleOptions; rating?: number; tags?: string[] }
>;

export interface MovieStore {
  shows: ShowItemType[];
  tagArray: Tag[];
  genreArray: string[];
  // Updated with on the providers stored on shows, updated via "UPDATE_SHOW_PROVIDERS" event bus call.
  streamingProviders: ProviderInfo[];
  pendingChanges: PendingChanges;
  debugView: boolean;
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

    // Add Pending Changes to list
    setPendingChanges: (movieId: number, updatedPendingchanges: PendingChanges[MovieId]) => void;
    // Commit all pending changes
    commitPendingChanges: () => void;
    // Turn off debugging info
    toggleDebugView: () => void;
  };
}

const movieInitialState = {
  shows: [],
  tagArray: [],
  genreArray: [],
  streamingProviders: [],
  pendingChanges: {},
  debugView: false,
};
const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      ...movieInitialState,
      actions: {
        //~ ---------------------------------
        //~ NEW addShow
        addShow: async (show: movieSearchByTitle_Results) => {
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
                releaseDateEpoch: formatEpoch(show?.releaseDate?.epoch || 0),
                dateAddedEpoch: formatEpoch(Date.now()),
                genres: show?.genres,
                rating: 0,
                tags: [],
                existsInSaved: true,
                streaming: {
                  dateAddedEpoch: formatEpoch(Date.now()),
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
              requestAnimationFrame(() => resolve());
            } catch (error) {
              reject(error);
            }
          });
        },
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
          set((state) => ({
            shows: state.shows.filter((m) => m.id !== id),
          }));
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
            { id, name: tag, dateAdded: formatEpoch(Date.now()), pos: currTags.length },
          ];
          console.log("NEW Tags", newTags);
          set({ tagArray: newTags });
        },
        //~ ---------------------------------
        //~ tagRemove
        tagRemove: (tagId) => {
          const currTags = get().tagArray;
          let currShows = [...get().shows];
          // Remove the tag from all shows
          for (let show of currShows) {
            if (!show.tags) continue;
            show.tags = show.tags.filter((tag) => tag !== tagId);
          }
          const newTags = currTags.filter((currTag) => currTag.id !== tagId);
          set({ tagArray: newTags, shows: currShows });
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
          const selectedTags = showTags.map((showTag) => {
            // use the tagIndex as the position so we can sort in the same order as in the tags screen
            const tagIndex = tags.findIndex((el) => el.id === showTag);
            const tagInfo = tags[tagIndex]; //tags.find((el) => el.id === showTag);
            if (!tagInfo) return;
            return {
              id: tagInfo.id,
              name: tagInfo.name,
              position: tagIndex,
            };
          });

          return sortBy(selectedTags, "position")
            .map((final) => ({ id: final?.id, name: final?.name }))
            .filter((el): el is Pick<Tag, "id" | "name"> => el !== null && el !== undefined);
        },
        //~ ---------------------------------
        //~ clearStore
        clearStore: () => set({ shows: [], tagArray: [], genreArray: [], streamingProviders: [] }),
        setPendingChanges: (movieId, updatedPendingChanges) => {
          const allPending = get().pendingChanges;
          set((state) => ({
            pendingChanges: {
              ...state.pendingChanges,
              [movieId]: { ...allPending[movieId], ...updatedPendingChanges },
            },
          }));
          // console.log("PENDING CHANGES", get().pendingChanges);
        },
        commitPendingChanges: () => {
          // const allShows = [...get().shows];
          const pendingChanges = get().pendingChanges;

          // console.log("COMMITTING PENDING CHANGES", pendingChanges);
          for (const [movieId, changes] of Object.entries(pendingChanges)) {
            if (changes.watched) {
              const watched = changes.watched === "off" ? undefined : formatEpoch(Date.now());
              get().actions.updateShow(parseInt(movieId), { watched });
            }
            if (changes.favorited) {
              const favorited = changes.favorited === "off" ? undefined : formatEpoch(Date.now());
              get().actions.updateShow(parseInt(movieId), { favorited });
            }
            if (changes.rating) {
              get().actions.updateShow(parseInt(movieId), { rating: changes.rating });
            }
            if (changes.tags) {
              get().actions.updateShow(parseInt(movieId), {
                tags: changes.tags,
              });
            }
          }
          set({ pendingChanges: {} });
        },
        toggleDebugView: () => set((state) => ({ debugView: !state.debugView })),
      },
    }),
    {
      name: "movie-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({
        shows: state.shows,
        tagArray: state.tagArray,
        genreArray: state.genreArray,
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
  const toggleWatched = (
    movieId: number,
    action: "toggle" | "on" | "off" = "toggle",
    dateIn: number = Date.now()
  ) => {
    const watchedDate = formatEpoch(dateIn);
    const isWatched = useMovieStore.getState().actions.getShowById(movieId)?.watched;
    if (action === "toggle") {
      updateShow(movieId, { watched: isWatched ? undefined : watchedDate });
    } else {
      updateShow(movieId, { watched: action === "off" ? undefined : watchedDate });
    }
  };
  //~ toggleFavorited
  const toggleFavorited = (movieId: number, action?: "toggle" | "on" | "off") => {
    action = action ?? "toggle";
    const isFavorited = useMovieStore.getState().actions.getShowById(movieId)?.favorited;
    updateShow(movieId, { favorited: isFavorited ? undefined : formatEpoch(Date.now()) });
    if (action === "toggle") {
      updateShow(movieId, { favorited: isFavorited ? undefined : formatEpoch(Date.now()) });
    } else {
      updateShow(movieId, { favorited: action === "off" ? undefined : formatEpoch(Date.now()) });
    }
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
  const titleSearchValue = useSettingsStore((state) => state.titleSearchValue);
  const titleSearchScope = useSettingsStore((state) => state.titleSearchScope);
  const sortSettings = useSettingsStore((state) => state.sortSettings);

  const movies = useMovieStore((state) => state.shows);

  let filteredMovies: ShowItemType[] = [];
  // Loop through each saved movie and see if it meets criteria to be shown
  for (const movie of movies) {
    if (titleSearchScope === "all") {
      if (titleSearchValue !== "" && titleSearchValue) {
        if (movie.title.toLowerCase().includes(titleSearchValue.toLowerCase())) {
          filteredMovies.push(movie);
          continue;
        }
      }
    }
    if (titleSearchValue !== "" && titleSearchValue) {
      if (!movie.title.toLowerCase().includes(titleSearchValue.toLowerCase())) continue;
    }
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
      if (!includeTags.every((tag) => movie.tags?.includes(tag))) {
        continue;
      }
    }
    // Exclude Tags
    if (Array.isArray(excludeTags) && excludeTags?.length > 0) {
      // EVERY excludeTag is present in the movie's tags
      if (excludeTags.some((tag) => movie.tags?.includes(tag))) {
        continue;
      }
    }

    // Genres
    if (Array.isArray(includeGenres) && includeGenres?.length > 0) {
      if (!includeGenres.every((genre) => movie.genres?.includes(genre))) {
        continue;
      }
    }
    // Exclude Genres
    if (Array.isArray(excludeGenres) && excludeGenres?.length > 0) {
      // EVERY excludeTag is present in the movie's tags
      if (excludeGenres.some((genre) => movie.genres?.includes(genre))) {
        continue;
      }
    }
    // if we make it here, then add the movie to our filtered list
    filteredMovies.push(movie);
  }
  //!! Potential Sort Fields
  // filteredMovies[0].watched;
  // filteredMovies[0].favorited;
  // filteredMovies[0].title;
  // filteredMovies[0].dateAddedEpoch;
  // filteredMovies[0].rating;
  // sort
  const { sortFields, sortDirections } = getSort(sortSettings);

  filteredMovies = orderBy(filteredMovies, sortFields, sortDirections);
  return { filteredMovies, filteredCount: filteredMovies.length };
};

//-- UTILS

//- --------------------------------------
// Get active sort in correct order
//- --------------------------------------
const getSort = (sortSettings: SortField[]) => {
  const filteredAndSortedFields = sortSettings
    .filter((field) => field.active) // Filter for active fields
    .sort((a, b) => a.index - b.index); // Sort by index in ascending order

  const sortFields = filteredAndSortedFields.map((field) => field.sortField);
  const sortDirections = filteredAndSortedFields.map((field) => field.sortDirection);

  return {
    sortedFields: filteredAndSortedFields,
    sortFields,
    sortDirections,
  };
};

//- --------------------------------------
// doesShowExist
//- --------------------------------------
const doesShowExist = (allShows: number[], showToCheck: number) => {
  return allShows.includes(showToCheck);
};

//- --------------------------------------
// updateTagState
//- --------------------------------------
export type TagState = ReturnType<typeof updateTagState>[number];
export const updateTagState = (tags: Tag[], appliedTagIds: string[]) => {
  // Create a Set for fast lookups of applied tags
  const appliedTagSet = new Set(appliedTagIds);

  return tags.map((tag) => ({
    ...tag,
    applied: appliedTagSet.has(tag.id),
  }));
};

export default useMovieStore;
