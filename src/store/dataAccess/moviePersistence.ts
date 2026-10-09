import { AppState } from "react-native";
import { listSavedShowIds, MovieSnapshot, saveMovieSnapshot } from "./movieDatabase";

let enabled = false;
let pending: { userId: string; snapshot: MovieSnapshot } | undefined;
let flushTimer: ReturnType<typeof setTimeout> | undefined;

export const setMoviePersistenceEnabled = (next: boolean) => {
  enabled = next;
};

const flushMovieSnapshot = () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = undefined;
  }
  const next = pending;
  pending = undefined;
  if (!next) return;
  saveMovieSnapshot(next.userId, next.snapshot);
};

const scheduleFlush = () => {
  if (flushTimer) return;
  flushTimer = setTimeout(flushMovieSnapshot, 0);
};

export const enqueueMovieSnapshot = (userId: string, snapshot: MovieSnapshot) => {
  if (!enabled) return;
  pending = { userId, snapshot };
  scheduleFlush();
};

// The pending snapshot is the SQLite write that has not flushed yet. Search
// must see an add or delete immediately, and must not read the Zustand array.
export const getSavedShowIds = (userId: string): Set<number> => {
  if (pending?.userId === userId) {
    return new Set(
      pending.snapshot.shows.filter((show) => show.existsInSaved).map((show) => show.id)
    );
  }
  return new Set(listSavedShowIds(userId));
};

AppState.addEventListener("change", (state) => {
  if (state === "active") return;
  flushMovieSnapshot();
});
