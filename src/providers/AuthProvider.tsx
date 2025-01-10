import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {
  addNewUser,
  getAllUsers,
  signIn,
  signOut,
  removeUser,
  getCurrentUser,
  User,
  updateUser,
} from "@/store/dataAccess/localStorage-users";
import { deleteUserStorage, initCurrentUserStorage } from "@/store/dataAccess/storageAdapter";
import useMovieStore from "@/store/store.shows";
import { eventBus } from "@/store/eventBus";
import useSettingsStore from "@/store/store.settings";

type AuthProps = {
  currentUser: User | undefined;
  onRegister: (username: string) => void;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onRemoveUser: (user: User) => void;
  onUpdateUser: (id: string, newName: string) => void;
  initialized: boolean;
  getUsers: () => User[] | undefined;
  allUsers: User[];
};

const AuthContext = createContext<AuthProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [initialized, setInitialized] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // On app start, check to see if there is a current User
  // if so, initialize the currentUserStorage MMKV

  useEffect(() => {
    const currUser = getCurrentUser();
    eventBus.publish("CLEAR_SEARCH_STORES");
    // This sets storageAdapter for Zustand Persist Middleware
    initCurrentUserStorage(currUser);

    // Clear store if NO user and then rehydrate
    if (!currUser?.id) {
      useMovieStore.getState().actions.clearStore();
    }
    useMovieStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();

    setCurrentUser(currUser);
    setAllUsers(getUsers());
    setInitialized(true);
  }, []);

  //~ LOGIN -------------------------------------------
  const handleLogin = (user: User) => {
    // Clear the stores when creating logging in
    // Then when the signIn happens, the rehydrate will bring back the data
    eventBus.publish("CLEAR_SEARCH_STORES");
    useMovieStore.getState().actions.clearStore();
    useSettingsStore.getState().actions.resetSettingsStore();
    // Stores the selected user in MMKV currentUser Storage
    signIn(user);
    // Inits the Authed storage MMKV with currenUser name
    initCurrentUserStorage(user);
    if (!user) {
      useMovieStore.getState().actions.clearStore();
    }
    useMovieStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    // Current user exposed in the Auth Context
    setCurrentUser(user);
  };

  //~ Update User Name -------------------------------------------
  const handleUpdateUsername = (id: string, newName: string) => {
    console.log("NEW NAME", newName);
    updateUser(id, newName);
    setAllUsers(getUsers());
  };
  //~ REGISTER User -------------------------------------------
  const handleRegister = (username: string) => {
    // Clear the store when creating a new user
    useMovieStore.getState().actions.clearStore();
    useSettingsStore.getState().actions.resetSettingsStore();
    setAllUsers(addNewUser(username));
  };

  //~ DELETE User -------------------------------------------
  const handleRemoveUser = (user: User) => {
    const updatedUsers = removeUser(user.id);
    if (updatedUsers) {
      setAllUsers(updatedUsers);
    }
    deleteUserStorage(user);
  };

  //~ LOGOUT -------------------------------------------
  const handleLogout = () => {
    signOut();
    initCurrentUserStorage(undefined);
    setCurrentUser(undefined);
  };

  //~ GET ALL USERS -------------------------------------------
  const getUsers = (): User[] => {
    return getAllUsers();
  };

  const value: AuthProps = {
    initialized,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onLogout: handleLogout,
    onRemoveUser: handleRemoveUser,
    onUpdateUser: handleUpdateUsername,
    currentUser: currentUser,
    getUsers: getUsers,
    allUsers,
  };

  //~ RETURN PROVIDER -------------------------------------------
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
