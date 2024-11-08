import "../global.css";
import { PortalHost } from "@rn-primitives/portal";

import { useRootNavigationState, useSegments } from "expo-router";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";

import React, { useEffect, useState } from "react";
import { Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Lato_100Thin, Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { CustomLightTheme, CustomDarkTheme } from "../lib/colorThemes";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initTMDB } from "@markmccoid/tmdb_api";
import { setupEvents } from "../store/events";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 10000,
    },
  },
});

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  // true after initialize function done
  const [initialized, setInitialized] = useState(false);
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    Lato_100Thin,
    Lato_400Regular,
    Lato_700Bold,
  });
  const { currentUser: user } = useAuth();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  //~~ --------------------------
  //~~ Run initialize
  //~~ --------------------------
  useEffect(() => {
    const mainInit = async () => {
      const tmdbKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
      if (!tmdbKey) throw new Error("TMDB API Key not defined");
      await initTMDB(tmdbKey);

      //Setup Event Bus Events
      setupEvents(queryClient);
      setInitialized(true);
    };
    mainInit();
  }, []);

  //~~ ---------------------------------------------
  //~~ This useEffect will fire whenever the users navigates (segment change)
  //~~ This way our root "/" will always be analyzed and directed based on the
  //~~ the users authorized state
  //~~ In an actual implementation you would have a token or userid check.
  //~~ NOTE: useSegments cannot be used if useRootNavigationState() is being used. Causes infinite loop.
  //~~ ---------------------------------------------
  useEffect(() => {
    // console.log("SEG", segments);
    // Flag telling us if route is going to auth, a protected route
    const inAuthGroup = segments[0] === "(auth)";
    // checking to see if the +not-found route is active.  Note that this is a "special"
    // expo router rouate which is why I'm not checking the segment[0] for +not-found
    const routeNotFound =
      rootNavigationState?.routes[rootNavigationState.index || 0].name === "+not-found" &&
      segments.length > 0;
    // If we are NOT logged in (userId NOT present) AND we are trying to go to an auth group, redirect to Sign in page
    if (!user && inAuthGroup) {
      router.replace("/(signin)");
    }
    // If we are logged in, but NOT in auth group (and route is valid) redirect to default page (this is our "/" home)
    // Every other valid route that is in Auth group will just flow through to the Slot and present.
    else if (user && !inAuthGroup && !routeNotFound) {
      router.replace("/(auth)/(drawer)/(tabs)/home");
    }
  }, [segments, user, initialized]);

  //~~ ------------------------------------------------------
  //~~ Hide splashscreen when loaded
  //~~ ------------------------------------------------------
  useEffect(() => {
    if (initialized && loaded) {
      SplashScreen.hideAsync();
    }
  }, [initialized, loaded]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
};

// Not sure what this buys us.  We could do it all in one function above.
//~~ ------------------------------------------------------
//~~ This is the exported function.
//~~ Wrap all Providers here (TanStack Query, Contexts, etc.)
//~~ ------------------------------------------------------
export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";

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
