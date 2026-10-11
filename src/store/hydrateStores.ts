import { eventBus } from "./eventBus";
import { getCurrentUser, signIn, User } from "./dataAccess/localStorage-users";
import { initCurrentUserStorage } from "./dataAccess/storageAdapter";
import { migrateAllMovieStorage, migrateUserMovieStorage } from "./dataAccess/movieDatabase";
import useSettingsStore from "./store.settings";
import useMovieUiStore from "./store.movieUi";
import { queryClient } from "./queryClient";

const rehydrateSettings = async () => {
  await useSettingsStore.persist.rehydrate();
  if (!useSettingsStore.persist.hasHydrated()) {
    throw new Error("Saved movies could not be loaded.");
  }
};

// Call this only while storage points at the logged-out placeholder, so a user
// switch cannot wipe the previous account's settings.
const clearVolatileState = () => {
  useMovieUiStore.getState().clearPendingChanges();
  useSettingsStore.getState().actions.resetSettingsStore();
  queryClient.removeQueries({ queryKey: ["library"] });
};

export const hydrateCurrentUserStores = async (): Promise<User | undefined> => {
  const currentUser = getCurrentUser();
  initCurrentUserStorage(currentUser);
  migrateAllMovieStorage(currentUser?.id);
  await rehydrateSettings();
  eventBus.publish("CLEAR_SEARCH_STORES");
  return currentUser;
};

export const hydrateLoggedInUserStores = async (user: User) => {
  signIn(user);
  initCurrentUserStorage(undefined);
  clearVolatileState();
  initCurrentUserStorage(user);
  migrateUserMovieStorage(user.id);
  await rehydrateSettings();
  queryClient.removeQueries({ queryKey: ["library"] });
  eventBus.publish("CLEAR_SEARCH_STORES");
  eventBus.publish("INITIALIZE_APP");
};
