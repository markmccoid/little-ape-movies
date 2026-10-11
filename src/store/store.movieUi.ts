import { create } from "zustand";
import type { PendingChanges } from "./movieTypes";

type MovieUiStore = {
  pendingChanges: PendingChanges;
  debugView: boolean;
  setPendingChanges: (movieId: number, changes: PendingChanges[number]) => void;
  clearPendingChanges: () => void;
  toggleDebugView: () => void;
};

const useMovieUiStore = create<MovieUiStore>()((set) => ({
  pendingChanges: {},
  debugView: false,
  setPendingChanges: (movieId, changes) => {
    set((state) => ({
      pendingChanges: {
        ...state.pendingChanges,
        [movieId]: { ...state.pendingChanges[movieId], ...changes },
      },
    }));
  },
  clearPendingChanges: () => set({ pendingChanges: {} }),
  toggleDebugView: () => set((state) => ({ debugView: !state.debugView })),
}));

export default useMovieUiStore;
