import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  addNewUser,
  getAllUsers,
  signOut,
  removeUser,
  User,
  updateUser,
} from "@/store/dataAccess/localStorage-users";
import { deleteUserMovies } from "@/store/dataAccess/movieDatabase";
import { deleteUserStorage, initCurrentUserStorage } from "@/store/dataAccess/storageAdapter";
import { eventBus } from "@/store/eventBus";
import { hydrateCurrentUserStores, hydrateLoggedInUserStores } from "@/store/hydrateStores";

type AuthProps = {
  currentUser: User | undefined;
  onRegister: (username: string) => void;
  onLogin: (user: User) => Promise<void>;
  onLogout: () => void;
  onRemoveUser: (user: User) => void;
  onUpdateUser: (id: string, newName: string) => void;
  initialized: boolean;
  startupError: string | undefined;
  retryStartup: () => void;
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

const startupErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Saved movies could not be loaded.";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [initialized, setInitialized] = useState(false);
  const [startupError, setStartupError] = useState<string>();
  const [startupAttempt, setStartupAttempt] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadCurrentUser = async () => {
      try {
        const storedUser = await hydrateCurrentUserStores();
        if (cancelled) return;
        setCurrentUser(storedUser);
        setAllUsers(getAllUsers() ?? []);
        setStartupError(undefined);
        setInitialized(true);
      } catch (error: unknown) {
        if (cancelled) return;
        setInitialized(false);
        setStartupError(startupErrorMessage(error));
      }
    };

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [startupAttempt]);

  const retryStartup = () => {
    setStartupError(undefined);
    setInitialized(false);
    setStartupAttempt((attempt) => attempt + 1);
  };

  const handleLogin = async (user: User) => {
    await hydrateLoggedInUserStores(user);
    setCurrentUser(user);
    setAllUsers(getAllUsers() ?? []);
  };

  const handleUpdateUsername = (id: string, newName: string) => {
    updateUser(id, newName);
    setAllUsers(getAllUsers() ?? []);
  };

  const handleRegister = (username: string) => {
    initCurrentUserStorage(undefined);
    setAllUsers(addNewUser(username));
  };

  const handleRemoveUser = (user: User) => {
    const updatedUsers = removeUser(user.id);
    if (updatedUsers) {
      setAllUsers(updatedUsers);
    }
    deleteUserStorage(user);
    deleteUserMovies(user.id);
  };

  const handleLogout = () => {
    signOut();
    initCurrentUserStorage(undefined);
    eventBus.publish("CLEAR_SEARCH_STORES");
    setCurrentUser(undefined);
  };

  const getUsers = (): User[] => {
    return getAllUsers();
  };

  const value: AuthProps = {
    initialized,
    startupError,
    retryStartup,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onLogout: handleLogout,
    onRemoveUser: handleRemoveUser,
    onUpdateUser: handleUpdateUsername,
    currentUser: currentUser,
    getUsers: getUsers,
    allUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
