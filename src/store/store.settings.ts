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
    tags?: string[];
  };
  actions: {
    toggleSearchColumns: () => void;
    toggleIsWatched: () => void;
    toggleIsFavorited: () => void;
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
