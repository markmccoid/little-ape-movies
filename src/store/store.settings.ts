import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { eventBus } from "./eventBus";

interface SettingsStore {
  searchColumns: 2 | 3;
  ratingsTiers: {
    tierLimit: number;
    tierColor: string;
  }[];
  filterCriteria: {
    filterIsWatched?: boolean;
    filterIsFavorited?: boolean;
    includeTags?: string[];
    excludeTags?: string[];
    includeGenres?: string[];
    excludeGenres?: string[];
  };
  actions: {
    toggleSearchColumns: () => void;
    toggleIsWatched: () => void;
    toggleIsFavorited: () => void;
    updateTagsFilter: (
      tagType: "include" | "exclude",
      tagId: string,
      action: "add" | "remove"
    ) => void;
    updateGenresFilter: (
      genreType: "include" | "exclude",
      genre: string,
      action: "add" | "remove"
    ) => void;
    clearFilters: (filter: "Tags" | "Genres" | "all") => void;
  };
}

const settingsInitialState = {
  searchColumns: 3 as 2 | 3, // Default value, adjust as needed
  ratingsTiers: [
    {
      tierLimit: 60,
      tierColor: "#AC831F",
    },
    {
      tierLimit: 100,
      tierColor: "#579C31",
    },
  ],
  filterCriteria: {},
};

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...settingsInitialState,
      actions: {
        toggleSearchColumns: () => {
          set({ searchColumns: get().searchColumns === 3 ? 2 : 3 });
          eventBus.publish("TAG_SEARCH_RESULTS");
        },
        // ~ - - - - - - - - - - - - -
        // ~ Filter Criteria Actions
        // ~ - - - - - - - - - - - - -
        toggleIsWatched: () => {
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              filterIsWatched: !state.filterCriteria?.filterIsWatched,
            },
          }));
        },
        toggleIsFavorited: () => {
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              filterIsFavorited: !state.filterCriteria?.filterIsFavorited,
            },
          }));
        },
        /**Function handles setting both the include and exclude tags
         * It makes sure that if a tag is added to either include or exclude
         * that is will NOT exist in the other (invervse)
         */
        updateTagsFilter: (tagType, tagId, action) => {
          // Set tag type
          let tagTypeKey: keyof SettingsStore["filterCriteria"] = "includeTags";
          let tagTypeInverseKey: keyof SettingsStore["filterCriteria"] = "excludeTags";
          if (tagType === "exclude") {
            tagTypeKey = "excludeTags";
            tagTypeInverseKey = "includeTags";
          }

          let currTagsList = [...(get().filterCriteria?.[tagTypeKey] || [])];

          let newTagsList: string[] = [];

          //Make sure tagType's inverse doesn't include the tagId (whether adding or removing,
          // this tag should NEVER exist in the other bucket (include/exclude))
          let newInverseTags = [
            ...(get().filterCriteria?.[tagTypeInverseKey] || []).filter((el) => el !== tagId),
          ];

          if (action === "add") {
            newTagsList = Array.from(new Set([...currTagsList, tagId]));
          } else if (action === "remove") {
            newTagsList = currTagsList.filter((el) => el !== tagId);
          }
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              [tagTypeKey]: newTagsList,
              [tagTypeInverseKey]: newInverseTags,
            },
          }));
        },
        updateGenresFilter: (genreType, genre, action) => {
          // Set tag type
          let genreTypeKey: keyof SettingsStore["filterCriteria"] = "includeGenres";
          let genreTypeInverseKey: keyof SettingsStore["filterCriteria"] = "excludeGenres";
          if (genreType === "exclude") {
            genreTypeKey = "excludeGenres";
            genreTypeInverseKey = "includeGenres";
          }

          let currGenresList = [...(get().filterCriteria?.[genreTypeKey] || [])];

          let newGenresList: string[] = [];

          //Make sure genreType's inverse doesn't include the passed genre (whether adding or removing,
          // this genre should NEVER exist in the other bucket (include/exclude))
          let newInverseTags = [
            ...(get().filterCriteria?.[genreTypeInverseKey] || []).filter((el) => el !== genre),
          ];

          if (action === "add") {
            newGenresList = Array.from(new Set([...currGenresList, genre]));
          } else if (action === "remove") {
            newGenresList = currGenresList.filter((el) => el !== genre);
          }
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              [genreTypeKey]: newGenresList,
              [genreTypeInverseKey]: newInverseTags,
            },
          }));
          // console.log("GENRES", get().filterCriteria.includeGenres);
        },
        clearFilters: (filter) => {
          if (filter === "all") {
            set({
              filterCriteria: {},
            });
            return;
          }
          const includeFilter = `include${filter}`;
          const excludeFilter = `exclude${filter}`;
          set((state) => ({
            filterCriteria: { ...state.filterCriteria, [includeFilter]: [], [excludeFilter]: [] },
          }));
        },
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({ searchColumns: state.searchColumns }),
      // onRehydrateStorage: (state) => {
      //   console.log("Setting Rehydrate", state);
      // },
    }
  )
);

export const useSettingsActions = () => {
  return useSettingsStore((state) => state.actions);
};

//~ -----------------------------------------------------------------------------------------------
//~ useRatingsTier - determines the color for the each of the ratings
//~   In future, can allow users to update the color based on a scale of 0-10
//~ -----------------------------------------------------------------------------------------------
export const useRatingsTier = (rating: string | undefined, type: "imdb" | "rt" | "metascore") => {
  if (rating === "N/A" || !rating) return { finalRating: "N/A", ratingColor: "#aaaaaa" };
  let intRating = 0;
  let finalRating = "";
  switch (type) {
    case "metascore":
      intRating = parseInt(rating);
      finalRating = rating;
      break;
    case "imdb":
      intRating = parseInt(rating) * 10;
      finalRating = `${rating}/10`;
      break;
    case "rt":
      intRating = parseInt(rating.replace(/\s?%/, ""));
      finalRating = rating;
      break;
    default:
      return { finalRating: "N/A", ratingColor: "#aaaaaa" };
  }

  let ratingsColors = useSettingsStore.getState().ratingsTiers;
  // Sort the array by tierLimit in ascending order
  ratingsColors.sort((a, b) => a.tierLimit - b.tierLimit);

  // Find the first tier where the number is less than the tierLimit
  for (let i = 0; i < ratingsColors.length; i++) {
    if (intRating < ratingsColors[i].tierLimit) {
      return { finalRating, ratingColor: ratingsColors[i].tierColor };
    }
  }
  return { finalRating: "N/A", ratingColor: "#ccc" };
};
export default useSettingsStore;
