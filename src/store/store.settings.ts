import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StorageAdapter } from "./dataAccess/storageAdapter";

interface SettingsStore {
  searchColumns: number;
  actions: {
    toggleSearchColumns: () => void;
  };
}

const settingsInitialState = {
  searchColumns: 3, // Default value, adjust as needed
};

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...settingsInitialState,
      actions: {
        toggleSearchColumns: () => set({ searchColumns: get().searchColumns === 3 ? 2 : 3 }),
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

export default useSettingsStore;
