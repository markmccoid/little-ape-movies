import uuid from "react-native-uuid";
// mmkvStorage.js
import { MMKV } from "react-native-mmkv";

// Initialize the storage
export const storage = new MMKV();

type StorageKeys = {
  users: User[];
  currentUser: User;
};

export type User = {
  id: string;
  name: string;
};
//~~ Register/ADD New User (add to users array in storage)
export const addNewUser = (newUserName: string) => {
  const existingUsers = getItem("users") as User[];
  if (!newUserName || newUserName === "") return existingUsers || [];
  const newUserId = uuid.v4();
  let newUsers = existingUsers;
  if (existingUsers) {
    // Make sure we don't duplicate user names
    if (!existingUsers.some((el) => el.name === newUserName)) {
      newUsers = [...newUsers, { id: newUserId, name: newUserName }];
    }
  }
  setItem("users", newUsers);
  return newUsers;
};

export const updateUser = (userId: string, newName: string) => {
  const existingUsers = getItem("users") as User[];
  if (!userId || !newName) return;

  for (let user of existingUsers) {
    if (user.id === userId) {
      user.name = newName;
    }
  }
  console.log("Existing Updated", existingUsers);
  setItem("users", existingUsers);
};
//~~ REMOVE USER ----------------------------------------------
export const removeUser = (userId: string) => {
  const existingUsers = getItem("users");
  if (!existingUsers || !userId) return undefined;

  const newUsers = existingUsers.filter((el: User) => el.id !== userId);
  setItem("users", newUsers);
  return newUsers;
};

//~~ SIGNIN - Set currentUser local storage item
export const signIn = (user: User) => {
  setItem("currentUser", user);
};
//~~ SIGNOUT - remove currentUser local storage item
export const signOut = () => {
  removeItem("currentUser");
};
//~~ GET CURRENT USER - returns the current user stored in "currentUser" storage
export const getCurrentUser = (): User => {
  return getItem("currentUser");
};

//~~ GET ALL USERS ----------------------------------------------
export const getAllUsers = (): User[] => {
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
