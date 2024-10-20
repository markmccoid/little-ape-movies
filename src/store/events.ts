import { QueryClient } from "@tanstack/react-query";
import { eventBus } from "./eventBus";
import { movieGetWatchProviders, WatchProvidersType } from "@markmccoid/tmdb_api";
import useMovieStore from "./store.shows";
import { getImageColors } from "@/utils/color.utils";

//~~ -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//~~ Update Show Data Code
//~~ Updates WatchProvides
//~~ -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const utilFetchMovieWatchProviders = async (showId: number) => {
  const tempData = await movieGetWatchProviders(showId.toString());
  console.log("in UtilFetchWP");
  return tempData.data.results.US as WatchProvidersType;
};
//
const createUpdateShowProviders = (queryClient: QueryClient) => async (showId: number) => {
  // let wproviders = queryClient.getQueryData(["watchProviders", showId]);
  let wproviders: WatchProvidersType | undefined = undefined;
  try {
    wproviders = await queryClient.fetchQuery({
      queryKey: ["watchProviders", showId],
      queryFn: async () => await utilFetchMovieWatchProviders(showId),
      staleTime: 300000,
    });
  } catch (e) {
    console.log("Error in WatchProvider Event");
  }
  useMovieStore.getState().actions.updateShow(showId, {
    streaming: {
      dateAddedEpoch: Date.now(),
      providers: wproviders?.stream ? wproviders.stream.map((el) => el.providerId) : [],
    },
  });
};
//~~ -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//~~ Update Show Data Code END
//~~ -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//!! -------------------------------------------------------
//!! setUpEvents
//!! This is called in root _layout.tsx
//!! -------------------------------------------------------
export const setupEvents = (queryClient: QueryClient) => {
  //- Create updateShowProviders function (needs queryClient)
  const updateShowProviders = createUpdateShowProviders(queryClient);
  //~~ Subscribe UPDATE_SHOW_PROVIDERS
  eventBus.subscribe("UPDATE_SHOW_PROVIDERS", updateShowProviders);

  //~~ Subscribe GET_SHOW_COLORS
  eventBus.subscribe("GET_SHOW_COLORS", async (movieId: number, posterURL) => {
    // console.log("EVENT BUS", movieId, posterURL)
    const imageColors = await getImageColors(posterURL);
    // console.log("IMAGE COL gotten");
    useMovieStore.getState().actions.updateShow(movieId, { posterColors: imageColors });
  });
};
