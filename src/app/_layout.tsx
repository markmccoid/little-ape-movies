import "../global.css";
import { PortalHost } from "@rn-primitives/portal";

import { ThemeProvider, useRootNavigationState, useSegments, Slot, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";

import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Lato_100Thin, Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";

// import { useColorScheme } from "react-native";
import { useColorScheme } from "nativewind";
import { CustomLightTheme, CustomDarkTheme } from "../lib/colorThemes";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initTMDB } from "@markmccoid/tmdb_api";
import { setupEvents } from "../store/events";

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { eventBus } from "@/store/eventBus";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60000, // n * 1 minute
    },
  },
});

SplashScreen.preventAutoHideAsync();

const TMDB_INIT_TIMEOUT_MS = 20000;

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string) => {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
};

const startupErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "The app could not finish starting.";
};

const InitialLayout = () => {
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string>();
  const [initAttempt, setInitAttempt] = useState(0);
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    Lato_100Thin,
    Lato_400Regular,
    Lato_700Bold,
  });
  const {
    currentUser: user,
    initialized: storesHydrated,
    startupError: storeStartupError,
    retryStartup: retryStoreStartup,
  } = useAuth();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const startupError = storeStartupError ?? initError;

  useEffect(() => {
    if (!appReady || !storesHydrated) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const processInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (cancelled || !url) return;
      const { path } = Linking.parse(url);
      if (!path) return;
      if (path.includes("search")) {
        router.replace("/search");
      }
      timeoutId = setTimeout(() => {
        if (!cancelled) {
          router.push(`/${path}`);
        }
      }, 0);
    };

    void processInitialURL();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, appReady, storesHydrated]);

  // TMDB setup runs only after movie and settings rehydration. A failed or
  // hung init surfaces an error instead of leaving the splash screen up.
  useEffect(() => {
    if (!storesHydrated) return;

    let cancelled = false;
    let unsubscribeEvents = () => {};

    const mainInit = async () => {
      try {
        const tmdbKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
        if (!tmdbKey) throw new Error("TMDB API Key not defined");
        await withTimeout(
          initTMDB(tmdbKey),
          TMDB_INIT_TIMEOUT_MS,
          "Starting the app took too long. Check your connection and try again."
        );
        if (cancelled) return;

        const unsubscribe = setupEvents(queryClient);
        if (cancelled) {
          unsubscribe();
          return;
        }
        unsubscribeEvents = unsubscribe;
        eventBus.publish("INITIALIZE_APP");
        eventBus.publish("GENERATE_GENRES_ARRAY");
        setInitError(undefined);
        setAppReady(true);
      } catch (initFailure: unknown) {
        if (cancelled) return;
        setAppReady(false);
        setInitError(startupErrorMessage(initFailure));
      }
    };

    void mainInit();

    return () => {
      cancelled = true;
      unsubscribeEvents();
    };
  }, [storesHydrated, initAttempt]);

  // Redirect only after persisted movies and settings have rehydrated and
  // startup has finished. Otherwise the home list can paint another user's data.
  useEffect(() => {
    if (!storesHydrated || !appReady || startupError) return;

    const inAuthGroup = segments[0] === "(auth)";
    const routeNotFound =
      rootNavigationState?.routes[rootNavigationState.index || 0].name === "+not-found" &&
      segments.length > 0;
    if (!user && inAuthGroup) {
      router.replace("/(signin)");
    } else if (user && !inAuthGroup && !routeNotFound) {
      router.replace("/(auth)/(drawer)/(tabs)/home");
    }
  }, [segments, user, storesHydrated, appReady, startupError, rootNavigationState, router]);

  useEffect(() => {
    if (loaded && (appReady || startupError)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, appReady, startupError]);

  const retryStartup = () => {
    if (!storesHydrated) {
      retryStoreStartup();
      return;
    }
    setInitError(undefined);
    setAppReady(false);
    setInitAttempt((attempt) => attempt + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {!appReady ? (
        <View className="absolute inset-0 z-10 items-center justify-center bg-background px-8">
          {startupError ? (
            <>
              <Text className="text-center text-xl font-bold">Couldn&apos;t start the app</Text>
              <Text className="mt-3 text-center text-muted-foreground">{startupError}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={retryStartup}
                className="mt-6 rounded-lg bg-primary px-5 py-3"
              >
                <Text className="text-primary-foreground">Try again</Text>
              </Pressable>
            </>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      ) : null}
    </View>
  );
};

// Not sure what this buys us.  We could do it all in one function above.
//~~ ------------------------------------------------------
//~~ This is the exported function.
//~~ Wrap all Providers here (TanStack Query, Contexts, etc.)
//~~ ------------------------------------------------------
export default function RootLayout() {
  const colorSchemeObj = useColorScheme();
  const colorScheme = colorSchemeObj.colorScheme || "light";

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
            {/* <View style={themes[colorScheme]} className="flex-1"> */}
            <InitialLayout />
            {/* </View> */}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <PortalHost />
    </>
  );
}
