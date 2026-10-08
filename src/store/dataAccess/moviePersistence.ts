import { AppState } from "react-native";
import { MovieSnapshot, saveMovieSnapshot } from "./movieDatabase";

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

AppState.addEventListener("change", (state) => {
  if (state === "active") return;
  flushMovieSnapshot();
});
