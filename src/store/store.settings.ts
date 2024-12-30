import { sortBy } from "lodash";
import { sortArray } from "@/components/common/DragAndSort/helperFunctions";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";
import { eventBus } from "./eventBus";
import { defaultSortSettings, quickSorts } from "./sortSettings";
// Define the array as the single source of truth
const inclusionStates = ["off", "include", "exclude"] as const;

// Derive the type from the array
export type InclusionState = (typeof inclusionStates)[number];
type FilterCriteria = {
  filterIsWatched?: InclusionState;
  filterIsFavorited?: InclusionState;
  includeTags?: string[];
  excludeTags?: string[];
  includeGenres?: string[];
  excludeGenres?: string[];
};
export type FilterStatus = {
  overallStatus: "active" | "inactive";
  tags: "active" | "inactive";
  genres: "active" | "inactive";
  watched: "active" | "inactive";
  favorited: "active" | "inactive";
};
export type SavedFilters = {
  id: string;
  name: string;
  index: number;
  filter: FilterCriteria;
  sort: SortField[];
};

export type SortField = {
  id: string;
  index: number;
  active: boolean;
  sortDirection: "asc" | "desc";
  sortField: string;
  title: string;
  type: "alpha" | "date" | "number";
};

export type SavedQuickSort = {
  id: string;
  index: number;
  name: string;
  sort: SortField[];
};

interface SettingsStore {
  searchColumns: 2 | 3;
  ratingsTiers: {
    tierLimit: number;
    tierColor: string;
  }[];
  filterCriteria: FilterCriteria;
  titleSearchValue: string | undefined;
  // Search across all movies or just the ones available with the applied filtered
  titleSearchScope: "all" | "filteronly";
  sortSettings: SortField[];
  savedFilters: SavedFilters[];
  savedQuickSorts: SavedQuickSort[];
  actions: {
    toggleSearchColumns: () => void;
    setIsWatchedState: (inclusionState: InclusionState | 0 | 1 | 2) => void;
    setIsFavoritedState: (inclusionState: InclusionState | 0 | 1 | 2) => void;
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
    getFilterStatus: () => FilterStatus;
    updateSortSettings: (sortFields: SortField[]) => void;
    addUpdateQuickSort: (newQuickSort: Omit<SavedQuickSort, "index">) => void;
    overwriteAllQuickSorts: (quickSorts: SavedQuickSort[]) => void;
    deleteQuickSort: (qsId: string) => void;
    setTitleSearchValue: (searchValue: string) => void;
    setTitleSearchScope: (searchScope: "all" | "filteronly") => void;
    // Used mainly on logout to clear the settings so that if a new user created, it has the defaults.
    resetSettingsStore: () => void;
  };
}

//~ - - - - - - - - - - - - - -
//~ Initial Settings State
//~ - - - - - - - - - - - - - -
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
  titleSearchValue: undefined,
  titleSearchScope: "all" as const,
  savedQuickSorts: quickSorts,
  savedFilters: [],
  sortSettings: defaultSortSettings,
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
        setIsWatchedState: (inclusionState) => {
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              filterIsWatched: getInclusionValue(inclusionState),
            },
          }));
        },
        setIsFavoritedState: (inclusionState) => {
          set((state) => ({
            filterCriteria: {
              ...state.filterCriteria,
              filterIsFavorited: getInclusionValue(inclusionState),
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
        getFilterStatus: () => {
          const { filterCriteria } = get();
          const filterStatus: FilterStatus = {
            overallStatus: "inactive",
            tags: "inactive",
            genres: "inactive",
            watched: "inactive",
            favorited: "inactive",
          };
          if (filterCriteria.includeTags?.length || filterCriteria.excludeTags?.length) {
            filterStatus.tags = "active";
          }
          if (filterCriteria.includeGenres?.length || filterCriteria.excludeGenres?.length) {
            filterStatus.genres = "active";
          }

          // undefined is considered "off" so we need to check for that
          if (filterCriteria.filterIsWatched !== "off" && filterCriteria.filterIsWatched) {
            filterStatus.watched = "active";
          }
          if (filterCriteria.filterIsFavorited !== "off" && filterCriteria.filterIsFavorited) {
            filterStatus.favorited = "active";
          }
          if (
            filterStatus.tags === "active" ||
            filterStatus.genres === "active" ||
            filterStatus.watched === "active" ||
            filterStatus.favorited === "active"
          ) {
            filterStatus.overallStatus = "active";
          }
          return filterStatus;
        },
        updateSortSettings: (sortFields) => {
          set({ sortSettings: sortFields });
        },

        addUpdateQuickSort: (newQuickSort) => {
          // Sort based on existing indexes
          const sortedQS = sortBy(get().savedQuickSorts, "index");
          // Reindex (make sure 0 ... n)
          const savedQS = sortedQS.map((el, index) => ({ ...el, index }));

          // if existing quickSort this will return the index otherwise undefined
          const qsExists = savedQS.find((el) => el.id === newQuickSort.id)?.index;

          // if undefined, put as last quickSort
          const savedIndex = qsExists ?? savedQS.length;
          // Filter out in case we are updating
          const newQS = [
            { ...newQuickSort, index: savedIndex },
            ...savedQS.filter((el) => el.id !== newQuickSort.id),
          ];
          set({ savedQuickSorts: [...sortBy(newQS, "index")] });
        },
        overwriteAllQuickSorts: (quickSorts: SavedQuickSort[]) =>
          set({ savedQuickSorts: quickSorts }),
        deleteQuickSort: (qsId: string) => {
          set((state) => ({
            ...state,
            savedQuickSorts: state.savedQuickSorts.filter((el) => el.id !== qsId),
          }));
        },
        setTitleSearchValue: (searchValue) => {
          set({ titleSearchValue: searchValue });
        },
        setTitleSearchScope: (searchScope) => {
          set({ titleSearchScope: searchScope });
        },
        resetSettingsStore: () => {
          set({ ...settingsInitialState });
        },
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => StorageAdapter),
      partialize: (state) => ({
        searchColumns: state.searchColumns,
        filterCriteria: state.filterCriteria,
        sortSettings: state.sortSettings,
        savedFilters: state.savedFilters,
        savedQuickSorts: state.savedQuickSorts,
      }),
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
//~ -----------------------------------------------------------------------------------------------
//~ HELPER FUNCTION
//~ -----------------------------------------------------------------------------------------------
// --------------
// -- Helper functions for tri-state filters like Watched and Favorited
// Takes in an inlcusion string or a inclusion index and returns inclusion string
function getInclusionValue(inclusionState: InclusionState | 0 | 1 | 2) {
  // If a number then access the inclusionStates (defined globally) via index
  if (typeof inclusionState === "number" && !isNaN(inclusionState)) {
    // Access by index when inclusionState is a number
    return inclusionStates[inclusionState];
  }
  return inclusionState as InclusionState;
}
// takes an inclusion string and returns the appropriate index.  Useful for segmented control settings.
// 0 = "off" , 1 = "includes", 2 = "exclude"
export const getInclusionIndex = (inclusionState: InclusionState | undefined) => {
  const inclusionIndex = inclusionStates.findIndex((el) => el === inclusionState);
  if (inclusionIndex === -1) return 0;
  return inclusionIndex;
};
export default useSettingsStore;
