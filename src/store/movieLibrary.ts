import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { unionBy } from "lodash";
import type { movieSearchByTitle_Results, ProviderInfo } from "@markmccoid/tmdb_api";
import { formatEpoch } from "@/utils/utils";
import { eventBus } from "./eventBus";
import { queryClient } from "./queryClient";
import { getCurrentUser } from "./dataAccess/localStorage-users";
import {
  deleteShow,
  deleteTag,
  getShow,
  insertShow,
  insertTag,
  listGenres,
  listShows,
  listStreamingProviders,
  listTags,
  renameTag,
  saveStreamingProviders,
  setShowGenres,
  setShowTags,
  setTagPositions,
  updateShowFields,
  withMovieTransaction,
  type ShowListQuery,
} from "./dataAccess/movieDatabase";
import type { PendingChanges, ShowItemType, Tag } from "./movieTypes";
import useSettingsStore, { type SortField } from "./store.settings";
import useMovieUiStore from "./store.movieUi";

const libraryKey = (userId: string) => ["library", userId] as const;
const emptyShows: ShowItemType[] = [];
const emptyTags: Tag[] = [];
const emptyGenres: string[] = [];

export const movieKeys = {
  shows: (userId: string, query: ShowListQuery) => ["library", userId, "shows", query] as const,
  show: (userId: string, showId: number) => ["library", userId, "show", showId] as const,
  tags: (userId: string) => ["library", userId, "tags"] as const,
  genres: (userId: string) => ["library", userId, "genres"] as const,
};

const requireUserId = () => {
  const userId = getCurrentUser()?.id;
  if (!userId) throw new Error("Saved movies could not be updated.");
  return userId;
};

const patchShowCache = (userId: string, showId: number, patch: Partial<ShowItemType>) => {
  queryClient.setQueryData<ShowItemType | null>(movieKeys.show(userId, showId), (current) =>
    current ? { ...current, ...patch } : current
  );
  queryClient.setQueriesData<ShowItemType[]>({ queryKey: ["library", userId, "shows"] }, (current) =>
    current?.map((show) => (show.id === showId ? { ...show, ...patch } : show))
  );
};

const invalidateLibrary = (userId: string) => {
  queryClient.invalidateQueries({ queryKey: libraryKey(userId) });
};

const activeSort = (sortSettings: SortField[]): ShowListQuery["sort"] => {
  const fields = new Set<ShowListQuery["sort"][number]["field"]>([
    "title",
    "rating",
    "releaseDateEpoch",
    "dateAddedEpoch",
    "watched",
    "favorited",
  ]);
  return sortSettings
    .filter((field) => field.active)
    .sort((a, b) => a.index - b.index)
    .flatMap((field) => {
      if (!fields.has(field.sortField as ShowListQuery["sort"][number]["field"])) return [];
      return [
        {
          field: field.sortField as ShowListQuery["sort"][number]["field"],
          direction: field.sortDirection,
        },
      ];
    });
};

export const useMovies = () => {
  const userId = getCurrentUser()?.id;
  const {
    filterIsFavorited,
    filterIsWatched,
    includeTags,
    excludeTags,
    includeGenres,
    excludeGenres,
  } = useSettingsStore((state) => state.filterCriteria);
  const titleSearchValue = useSettingsStore((state) => state.titleSearchValue);
  const titleSearchScope = useSettingsStore((state) => state.titleSearchScope);
  const sortSettings = useSettingsStore((state) => state.sortSettings);

  const listQuery: ShowListQuery = {
    titleSearch: titleSearchValue?.trim() || undefined,
    titleSearchScope,
    watched: filterIsWatched ?? "off",
    favorited: filterIsFavorited ?? "off",
    includeTags: includeTags ?? [],
    excludeTags: excludeTags ?? [],
    includeGenres: includeGenres ?? [],
    excludeGenres: excludeGenres ?? [],
    sort: activeSort(sortSettings),
  };

  const query = useQuery({
    queryKey: movieKeys.shows(userId ?? "", listQuery),
    queryFn: () => listShows(userId!, listQuery),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });

  const filteredMovies = query.data ?? emptyShows;
  return { filteredMovies, filteredCount: filteredMovies.length, isLoading: query.isLoading };
};

export const useShow = (showId: number | undefined) => {
  const userId = getCurrentUser()?.id;
  return useQuery({
    queryKey: movieKeys.show(userId ?? "", showId ?? 0),
    queryFn: () => getShow(userId!, showId!),
    enabled: !!userId && !!showId,
  });
};

export const useTags = () => {
  const userId = getCurrentUser()?.id;
  const query = useQuery({
    queryKey: movieKeys.tags(userId ?? ""),
    queryFn: () => listTags(userId!),
    enabled: !!userId,
  });
  return query.data ?? emptyTags;
};

export const useGenres = () => {
  const userId = getCurrentUser()?.id;
  const query = useQuery({
    queryKey: movieKeys.genres(userId ?? ""),
    queryFn: () => listGenres(userId!),
    enabled: !!userId,
  });
  return query.data ?? emptyGenres;
};

export const useGetAppliedTags = (showId: number | undefined) => {
  const show = useShow(showId);
  const tags = useTags();
  const appliedIds = new Set(show.data?.tags ?? []);
  return tags
    .filter((tag) => appliedIds.has(tag.id))
    .map((tag) => ({ id: tag.id, name: tag.name }));
};

const writeShowPatch = (userId: string, showId: number, patch: Partial<ShowItemType>) => {
  const { tags, genres, id: _id, ...fields } = patch;
  withMovieTransaction(() => {
    updateShowFields(userId, showId, fields);
    if (tags) setShowTags(userId, showId, tags);
    if (genres) setShowGenres(userId, showId, genres);
  });
  patchShowCache(userId, showId, patch);
  invalidateLibrary(userId);
};

export const useMovieActions = () => {
  const queryClient = useQueryClient();

  const updateShow = (id: number, patch: Partial<ShowItemType>) => {
    writeShowPatch(requireUserId(), id, patch);
  };

  const addShow = async (show: movieSearchByTitle_Results) => {
    if (!show.id) return;
    const userId = requireUserId();
    if (getShow(userId, show.id)) return;

    const newShow: ShowItemType = {
      id: show.id,
      title: show.title,
      posterURL: show.posterURL,
      backdropURL: show.backdropURL,
      releaseDateEpoch: formatEpoch(show.releaseDate?.epoch || 0),
      dateAddedEpoch: formatEpoch(Date.now()),
      genres: show.genres ?? [],
      rating: 0,
      tags: [],
      existsInSaved: true,
      streaming: { dateAddedEpoch: formatEpoch(Date.now()), providers: [] },
    };
    insertShow(userId, newShow);
    queryClient.setQueryData(movieKeys.show(userId, newShow.id), newShow);
    invalidateLibrary(userId);
    eventBus.publish("TAG_SEARCH_RESULTS");
    eventBus.publish("UPDATE_SHOW_PROVIDERS", show.id);
    eventBus.publish("GET_SHOW_COLORS", newShow.id, newShow.posterURL);
  };

  const removeShow = async (id: number) => {
    const userId = requireUserId();
    deleteShow(userId, id);
    queryClient.removeQueries({ queryKey: movieKeys.show(userId, id) });
    invalidateLibrary(userId);
    eventBus.publish("TAG_SEARCH_RESULTS");
  };

  const updateShowTags = (id: number, tagId: string, action: "add" | "remove") => {
    const userId = requireUserId();
    const current = getShow(userId, id)?.tags ?? [];
    const tags =
      action === "remove"
        ? current.filter((tag) => tag !== tagId)
        : Array.from(new Set([...current, tagId]));
    writeShowPatch(userId, id, { tags });
  };

  const updateStreamingProviders = (newProviders: ProviderInfo[] | undefined) => {
    if (!newProviders) return;
    const userId = requireUserId();
    const merged = unionBy(listStreamingProviders(userId), newProviders, "providerId");
    saveStreamingProviders(userId, merged);
  };

  const toggleWatched = (
    movieId: number,
    action: "toggle" | "on" | "off" = "toggle",
    dateIn: number = Date.now()
  ) => {
    const userId = requireUserId();
    const isWatched = getShow(userId, movieId)?.watched;
    const watchedDate = formatEpoch(dateIn);
    const watched =
      action === "off" || (action === "toggle" && isWatched) ? undefined : watchedDate;
    writeShowPatch(userId, movieId, { watched });
  };

  const toggleFavorited = (movieId: number, action: "toggle" | "on" | "off" = "toggle") => {
    const userId = requireUserId();
    const isFavorited = getShow(userId, movieId)?.favorited;
    const favorited =
      action === "off" || (action === "toggle" && isFavorited)
        ? undefined
        : formatEpoch(Date.now());
    writeShowPatch(userId, movieId, { favorited });
  };

  const tagAdd = (tag: string) => {
    const name = tag.trim();
    if (!name) return;
    const userId = requireUserId();
    const current = listTags(userId);
    const exists = current.some((item) => item.name.toLowerCase() === name.toLowerCase());
    if (exists) throw new Error("duplicate");
    insertTag(userId, {
      id: Date.now().toString(36),
      name,
      dateAdded: formatEpoch(Date.now()),
      pos: current.length,
    });
    invalidateLibrary(userId);
  };

  const tagRemove = (tagId: string) => {
    const userId = requireUserId();
    deleteTag(userId, tagId);
    invalidateLibrary(userId);
  };

  const tagEdit = (tagId: string, newTagName: string) => {
    const name = newTagName.trim();
    if (!name) return;
    const userId = requireUserId();
    const current = listTags(userId);
    const exists = current.some(
      (item) => item.id !== tagId && item.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) throw new Error("duplicate");
    renameTag(userId, tagId, name);
    invalidateLibrary(userId);
  };

  const tagUpdateOrder = (tags: Tag[]) => {
    const userId = requireUserId();
    setTagPositions(
      userId,
      tags.map((tag) => tag.id)
    );
    invalidateLibrary(userId);
  };

  const setPendingChanges = (movieId: number, updated: PendingChanges[number]) => {
    useMovieUiStore.getState().setPendingChanges(movieId, updated);
  };

  const commitPendingChanges = () => {
    const userId = getCurrentUser()?.id;
    const pending = useMovieUiStore.getState().pendingChanges;
    if (!userId) {
      useMovieUiStore.getState().clearPendingChanges();
      return;
    }
    withMovieTransaction(() => {
      for (const [movieId, changes] of Object.entries(pending)) {
        const id = Number(movieId);
        if (changes.watched) {
          updateShowFields(userId, id, {
            watched: changes.watched === "off" ? undefined : formatEpoch(Date.now()),
          });
        }
        if (changes.favorited) {
          updateShowFields(userId, id, {
            favorited: changes.favorited === "off" ? undefined : formatEpoch(Date.now()),
          });
        }
        if (changes.rating !== undefined) {
          updateShowFields(userId, id, { rating: changes.rating });
        }
        if (changes.tags) setShowTags(userId, id, changes.tags);
      }
    });
    useMovieUiStore.getState().clearPendingChanges();
    invalidateLibrary(userId);
  };

  return {
    addShow,
    updateShow,
    updateShowTags,
    updateStreamingProviders,
    removeShow,
    getShowById: (id: number) => {
      const userId = getCurrentUser()?.id;
      return userId ? (getShow(userId, id) ?? undefined) : undefined;
    },
    tagAdd,
    tagRemove,
    tagEdit,
    tagUpdateOrder,
    setPendingChanges,
    commitPendingChanges,
    toggleWatched,
    toggleFavorited,
    toggleDebugView: () => useMovieUiStore.getState().toggleDebugView(),
  };
};
