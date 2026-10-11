import { QueryClient } from "@tanstack/react-query";
import { eventBus } from "./eventBus";
import { movieGetWatchProviders, WatchProvidersType } from "@markmccoid/tmdb_api";
import { getImageColors } from "@/utils/color.utils";
import { formatEpoch } from "@/utils/utils";
import { getCurrentUser } from "./dataAccess/localStorage-users";
import {
  listStreamingProviders,
  saveStreamingProviders,
  setShowGenres,
  updateShowFields,
  withMovieTransaction,
} from "./dataAccess/movieDatabase";
import { unionBy } from "lodash";
import useSettingsStore from "./store.settings";
import { queryClient } from "./queryClient";
import type { ShowItemType } from "./movieTypes";

const libraryKey = (userId: string) => ["library", userId] as const;

const saveShowPatch = (showId: number, patch: Partial<ShowItemType>) => {
  const userId = getCurrentUser()?.id;
  if (!userId) return;
  const { tags: _tags, genres, id: _id, ...fields } = patch;
  withMovieTransaction(() => {
    updateShowFields(userId, showId, fields);
    if (genres) setShowGenres(userId, showId, genres);
  });
  queryClient.setQueryData<ShowItemType | null>(["library", userId, "show", showId], (current) =>
    current ? { ...current, ...patch } : current
  );
  queryClient.invalidateQueries({ queryKey: libraryKey(userId) });
};

const utilFetchMovieWatchProviders = async (showId: number) => {
  const tempData = await movieGetWatchProviders(showId.toString());
  return tempData.data.results.US as WatchProvidersType;
};

const createUpdateShowProviders = (client: QueryClient) => async (showId: number) => {
  let wproviders: WatchProvidersType | undefined = undefined;
  try {
    wproviders = await client.fetchQuery({
      queryKey: ["watchProviders", showId],
      queryFn: async () => await utilFetchMovieWatchProviders(showId),
      staleTime: 300000,
    });
  } catch (e) {
    console.log("Error in WatchProvider Event");
    return;
  }
  const userId = getCurrentUser()?.id;
  if (userId && wproviders?.stream) {
    const merged = unionBy(listStreamingProviders(userId), wproviders.stream, "providerId");
    saveStreamingProviders(userId, merged);
  }
  saveShowPatch(showId, {
    streaming: {
      dateAddedEpoch: formatEpoch(Date.now()),
      providers: wproviders?.stream ? wproviders.stream.map((el) => el.providerId) : [],
    },
  });
};

export const setupEvents = (client: QueryClient) => {
  const updateShowProviders = createUpdateShowProviders(client);
  const unsubscribeUpdateProviders = eventBus.subscribe(
    "UPDATE_SHOW_PROVIDERS",
    updateShowProviders
  );

  const unsubscribeShowColors = eventBus.subscribe(
    "GET_SHOW_COLORS",
    async (movieId: number, posterURL) => {
      const imageColors = await getImageColors(posterURL);
      if (!imageColors) return;
      saveShowPatch(movieId, { posterColors: imageColors });
    }
  );

  const unsubscribeGenres = eventBus.subscribe("GENERATE_GENRES_ARRAY", () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    queryClient.invalidateQueries({ queryKey: ["library", userId, "genres"] });
  });

  const unsubscribeInitialize = eventBus.subscribe("INITIALIZE_APP", () => {
    try {
      const settingsActions = useSettingsStore.getState().actions;
      const defaultFilterId = useSettingsStore.getState().defaultFilter;
      settingsActions.activateSavedFilter(defaultFilterId);
    } catch (e) {
      console.log("Error in INITIALIZE_APP event", e);
    }
  });

  return () => {
    unsubscribeUpdateProviders();
    unsubscribeShowColors();
    unsubscribeGenres();
    unsubscribeInitialize();
  };
};
