import { eventBus } from "./eventBus";
import { getCurrentUser, signIn, User } from "./dataAccess/localStorage-users";
import { initCurrentUserStorage } from "./dataAccess/storageAdapter";
import {
  emptyMovieSnapshot,
  loadMovieSnapshot,
  migrateAllMovieStorage,
  migrateUserMovieStorage,
  MovieSnapshot,
} from "./dataAccess/movieDatabase";
import { setMoviePersistenceEnabled } from "./dataAccess/moviePersistence";
import useSettingsStore from "./store.settings";
import useMovieStore from "./store.shows";

const applyMovieSnapshot = (snapshot: MovieSnapshot) => {
  useMovieStore.setState({
    shows: snapshot.shows,
    tagArray: snapshot.tagArray,
    genreArray: snapshot.genreArray,
    streamingProviders: snapshot.streamingProviders,
    pendingChanges: {},
  });
};

const rehydrateSettings = async () => {
  await useSettingsStore.persist.rehydrate();
  if (!useSettingsStore.persist.hasHydrated()) {
    throw new Error("Saved movies could not be loaded.");
  }
};

// Writes the in-memory movie and settings state. Call this only while storage
// points at the logged-out placeholder, and while movie persistence is paused,
// so a user switch cannot wipe the previous account.
const clearVolatileState = () => {
  useMovieStore.getState().actions.clearStore();
  useMovieStore.setState({ pendingChanges: {} });
  useSettingsStore.getState().actions.resetSettingsStore();
};

export const hydrateCurrentUserStores = async (): Promise<User | undefined> => {
  const currentUser = getCurrentUser();
  initCurrentUserStorage(currentUser);
  setMoviePersistenceEnabled(false);
  migrateAllMovieStorage(currentUser?.id);
  const snapshot = currentUser ? loadMovieSnapshot(currentUser.id) : emptyMovieSnapshot();
  applyMovieSnapshot(snapshot);
  await rehydrateSettings();
  setMoviePersistenceEnabled(Boolean(currentUser?.id));
  eventBus.publish("CLEAR_SEARCH_STORES");
  return currentUser;
};

export const hydrateLoggedInUserStores = async (user: User) => {
  setMoviePersistenceEnabled(false);
  signIn(user);
  initCurrentUserStorage(undefined);
  clearVolatileState();
  initCurrentUserStorage(user);
  migrateUserMovieStorage(user.id);
  await rehydrateSettings();
  applyMovieSnapshot(loadMovieSnapshot(user.id));
  setMoviePersistenceEnabled(true);
  eventBus.publish("CLEAR_SEARCH_STORES");
  eventBus.publish("INITIALIZE_APP");
  eventBus.publish("GENERATE_GENRES_ARRAY");
};
