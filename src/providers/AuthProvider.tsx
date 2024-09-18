import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {
  addNewUser,
  getAllUsers,
  signIn,
  signOut,
  removeUser,
  getCurrentUser,
} from "@/store/dataAccess/localStorage-users";
import { deleteUserStorage, initCurrentUserStorage } from "@/store/dataAccess/storageAdapter";
import useMovieStore from "@/store/store.shows";
import { eventBus } from "@/store/eventBus";

type AuthProps = {
  currentUser: string | undefined;
  onRegister: (user: string) => void;
  onLogin: (user: string) => void;
  onLogout: () => void;
  onRemoveUser: (user: string) => void;
  initialized: boolean;
  getUsers: () => string[] | undefined;
  allUsers: string[];
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
  const [currentUser, setCurrentUser] = useState<string>();
  const [initialized, setInitialized] = useState(false);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  // On app start, check to see if there is a current User
  // if so, initialize the currentUserStorage MMKV

  useEffect(() => {
    const currUser = getCurrentUser();
    eventBus.publish("CLEAR_SEARCH_STORES");
    // This sets storageAdapter for Zustand Persist Middleware
    initCurrentUserStorage(currUser);

    // Clear store if NO user and then rehydrate
    if (!currUser) {
      useMovieStore.getState().actions.clearStore();
    }
    useMovieStore.persist.rehydrate();

    setCurrentUser(currUser);
    setAllUsers(getUsers());
    setInitialized(true);
  }, []);

  //~ LOGIN -------------------------------------------
  const handleLogin = (user: string) => {
    eventBus.publish("CLEAR_SEARCH_STORES");
    // Stores the selected user in MMKV currentUser Storage
    signIn(user);
    // Inits the Authed storage MMKV with currenUser name
    initCurrentUserStorage(user);
    if (!user) {
      useMovieStore.getState().actions.clearStore();
    }
    useMovieStore.persist.rehydrate();
    // Current user exposed in the Auth Context
    setCurrentUser(user);
  };

  //~ REGISTER User -------------------------------------------
  const handleRegister = (user: string) => {
    setAllUsers(addNewUser(user));
  };

  //~ DELETE User -------------------------------------------
  const handleRemoveUser = (user: string) => {
    const updatedUsers = removeUser(user);
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
  const getUsers = () => {
    return getAllUsers();
  };

  const value: AuthProps = {
    initialized,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onLogout: handleLogout,
    onRemoveUser: handleRemoveUser,
    currentUser: currentUser,
    getUsers: getUsers,
    allUsers,
  };

  //~ RETURN PROVIDER -------------------------------------------
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
