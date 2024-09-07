import { MMKV } from "react-native-mmkv";
const sample = require("../../assets/moviesamples.json");

type Movies = {
  id: string;
  title: string;
  image: string;
  dateAdded: string; // or number. number easier to sort
  tags?: string[];
  genres?: string[];
  rating?: number;
};
type AuthedStorage = {
  test: string;
  movies: Movies[];
  filter: {
    tags: string[];
  };
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
};
let storage: MMKV | undefined;
//~~ Initialize the storage --------------------------------------
export const initCurrentUserStorage = (currentUser: string) => {
  // If the user is undefined return a null storage object (We really don't need to return anything.)
  if (!currentUser) {
    storage = undefined;
    return storage;
  }
  storage = new MMKV({
    id: `${currentUser}.storage`,
  });

  // setAuthedItem("movies", JSON.stringify(sample));
  setAuthedItem("test", "testString");
  return storage;
};

export const getAuthedStorage = () => storage;
//~~ SET ----------------------------------------------------------------
export const setAuthedItem = <T extends keyof AuthedStorage>(
  key: T,
  value: AuthedStorage[T]
): void => {
  if (!storage) {
    throw new Error("User Storage Undefined");
  }
  if (typeof value === "string") {
    storage.set(key as string, value);
  } else if (typeof value === "boolean") {
    storage.set(key as string, value);
  } else if (typeof value === "number") {
    storage.set(key as string, value);
  }
};

//~~ GETS ----------------------------------------------------------------
export const getAuthedItem = <T extends keyof AuthedStorage>(
  key: T
): AuthedStorage[T] | undefined => {
  if (!storage) {
    throw new Error("User Storage Undefined");
  }
  const value = storage.getString(key as string);
  let finalVal;
  try {
    finalVal = value && JSON.parse(value);
  } catch (e) {
    finalVal = value;
  }
  return finalVal as AuthedStorage[T] | undefined;
};

const getBoolean = (key: keyof AuthedStorage): boolean | undefined => {
  if (!storage) {
    throw new Error("User Storage Undefined");
  }
  return storage.getBoolean(key as string);
};

const getNumber = (key: keyof AuthedStorage): number | undefined => {
  if (!storage) {
    throw new Error("User Storage Undefined");
  }
  return storage.getNumber(key as string);
};
