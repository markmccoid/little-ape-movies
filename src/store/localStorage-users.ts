// mmkvStorage.js
import { MMKV } from "react-native-mmkv";

// Initialize the storage
export const storage = new MMKV();

type StorageKeys = {
  users: string[];
  currentUser: string;
};

//~~ Register/ADD New User (add to users array in storage)
export const addNewUser = (newUserName: string) => {
  const existingUsers = getItem("users");
  if (!newUserName || newUserName === "") return existingUsers || [];
  let newUsers = [newUserName];
  if (existingUsers) {
    // Make sure we don't duplicate user names
    newUsers = Array.from(new Set([...existingUsers, newUserName]));
  }
  setItem("users", newUsers);
  return newUsers;
};

//~~ REMOVE USER ----------------------------------------------
export const removeUser = (user: string) => {
  const existingUsers = getItem("users");
  if (!existingUsers || !user) return undefined;

  const newUsers = existingUsers.filter((el: string) => el !== user);
  setItem("users", newUsers);
  return newUsers;
};

//~~ SIGNIN - Set currentUser local storage item
export const signIn = (user: string) => {
  setItem("currentUser", user);
};
//~~ SIGNOUT - remove currentUser local storage item
export const signOut = () => {
  removeItem("currentUser");
};
//~~ GET CURRENT USER - returns the current user stored in "currentUser" storage
export const getCurrentUser = () => {
  return getItem("currentUser");
};

//~~ GET ALL USERS ----------------------------------------------
export const getAllUsers = () => {
  return getItem("users");
};

//~~ MMKV Utility Functions ----------------------------------------------
export const setItem = <K extends keyof StorageKeys>(key: K, value: StorageKeys[K]) => {
  storage.set(key, JSON.stringify(value));
};

export const getItem = (key: keyof StorageKeys) => {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : undefined;
};

export const removeItem = (key: keyof StorageKeys) => {
  storage.delete(key);
};
