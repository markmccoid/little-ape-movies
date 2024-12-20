import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { getAuthedStorage } from "./localStorage-authed";
import { getCurrentUser } from "./localStorage-users";

// const currentUser = getCurrentUser();
// console.log("CURR USER", currentUser);
let storage: MMKV | undefined = undefined;
export const initCurrentUserStorage = (currentUser: string | undefined) => {
  // If the user is undefined return a null storage object (We really don't need to return anything.)
  if (!currentUser) {
    storage = new MMKV({
      id: `loggedout.placeholder`,
    });
    return storage;
  }

  storage = new MMKV({
    id: `${currentUser}.storage`,
  });

  // setAuthedItem("movies", JSON.stringify(sample));
  storage.set("name", `${currentUser}.storage`);
  return storage;
};
//~ ----- DELETE USER STORAE ------------------------------------
export const deleteUserStorage = (currentUser: string) => {
  // Initialize the MMKV instance for this user
  const userStorage = new MMKV({
    id: `${currentUser}.storage`,
  });

  // Clear all data from the storage
  userStorage.clearAll();

  console.log(`Storage for user ${currentUser} has been deleted.`);
};

//~ -----  STORAGE ADAPTER ------------------------------------
export const StorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (!storage) {
      throw new Error("Storage is not initialized");
    }
    // console.log("STORAGE GET", name);
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!storage) {
      throw new Error("Storage is not initialized");
    }
    // console.log("SET", name, value);
    storage.set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (!storage) {
      throw new Error("Storage is not initialized");
    }
    storage.delete(name);
  },
};
