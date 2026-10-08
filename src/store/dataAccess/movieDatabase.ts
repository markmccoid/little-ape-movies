import { MMKV } from "react-native-mmkv";
import * as SQLite from "expo-sqlite";
import type { ProviderInfo } from "@markmccoid/tmdb_api";
import type { ShowItemType, Tag } from "@/store/store.shows";
import { getAllUsers } from "./localStorage-users";
import type { ImageColors } from "@/utils/color.utils";

export type MovieSnapshot = {
  shows: ShowItemType[];
  tagArray: Tag[];
  genreArray: string[];
  streamingProviders: ProviderInfo[];
};

const DATABASE_NAME = "little-ape-movies.db";

const emptyMovieSnapshot = (): MovieSnapshot => ({
  shows: [],
  tagArray: [],
  genreArray: [],
  streamingProviders: [],
});

let database: SQLite.SQLiteDatabase | undefined;

const getMovieDatabase = () => {
  if (database) return database;
  const db = SQLite.openDatabaseSync(DATABASE_NAME);
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS shows (
      user_id TEXT NOT NULL,
      id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_url TEXT,
      poster_colors TEXT,
      backdrop_url TEXT,
      release_date_epoch INTEGER NOT NULL,
      date_added_epoch INTEGER NOT NULL,
      genres TEXT NOT NULL,
      rating REAL NOT NULL,
      tag_ids TEXT NOT NULL,
      exists_in_saved INTEGER NOT NULL,
      streaming_date_added_epoch INTEGER NOT NULL,
      streaming_provider_ids TEXT NOT NULL,
      watched INTEGER,
      favorited INTEGER,
      PRIMARY KEY (user_id, id)
    );
    CREATE TABLE IF NOT EXISTS tags (
      user_id TEXT NOT NULL,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      date_added INTEGER NOT NULL,
      pos INTEGER NOT NULL,
      PRIMARY KEY (user_id, id)
    );
    CREATE TABLE IF NOT EXISTS user_movie_cache (
      user_id TEXT PRIMARY KEY NOT NULL,
      genre_array TEXT NOT NULL,
      streaming_providers TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movie_storage_migrations (
      user_id TEXT PRIMARY KEY NOT NULL,
      migrated_at INTEGER NOT NULL
    );
  `);
  database = db;
  return db;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readError = () => new Error("Saved movies could not be read.");

const optionalString = (value: unknown) => {
  if (value == null) return undefined;
  if (typeof value !== "string") throw readError();
  return value;
};

const optionalNumber = (value: unknown) => {
  if (value == null) return undefined;
  if (typeof value !== "number" || Number.isNaN(value)) throw readError();
  return value;
};

const parseStringArray = (value: unknown) => {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw readError();
  return value;
};

const parseNumberArray = (value: unknown) => {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number")) throw readError();
  return value;
};

const parsePosterColors = (value: unknown): ImageColors | undefined => {
  if (value == null) return undefined;
  if (!isRecord(value)) throw readError();
  return value as ImageColors;
};

const parseStreaming = (value: unknown): ShowItemType["streaming"] => {
  if (value == null) return { dateAddedEpoch: 0, providers: [] };
  if (!isRecord(value)) throw readError();
  return {
    dateAddedEpoch: optionalNumber(value.dateAddedEpoch) ?? 0,
    providers: parseNumberArray(value.providers),
  };
};

const parseShows = (value: unknown): ShowItemType[] => {
  if (value == null) return [];
  if (!Array.isArray(value)) throw readError();
  return value.map((item) => {
    if (!isRecord(item) || typeof item.id !== "number" || typeof item.title !== "string") {
      throw readError();
    }
    return {
      id: item.id,
      title: item.title,
      posterURL: optionalString(item.posterURL),
      posterColors: parsePosterColors(item.posterColors),
      backdropURL: optionalString(item.backdropURL),
      releaseDateEpoch: optionalNumber(item.releaseDateEpoch) ?? 0,
      dateAddedEpoch: optionalNumber(item.dateAddedEpoch) ?? 0,
      genres: parseStringArray(item.genres),
      rating: optionalNumber(item.rating) ?? 0,
      tags: parseStringArray(item.tags),
      existsInSaved: item.existsInSaved !== false,
      streaming: parseStreaming(item.streaming),
      watched: optionalNumber(item.watched),
      favorited: optionalNumber(item.favorited),
    };
  });
};

const parseTags = (value: unknown): Tag[] => {
  if (value == null) return [];
  if (!Array.isArray(value)) throw readError();
  return value.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.dateAdded !== "number" ||
      typeof item.pos !== "number"
    ) {
      throw readError();
    }
    return {
      id: item.id,
      name: item.name,
      dateAdded: item.dateAdded,
      pos: item.pos,
    };
  });
};

const isProvider = (value: unknown): value is ProviderInfo =>
  isRecord(value) &&
  typeof value.provider === "string" &&
  typeof value.logoURL === "string" &&
  typeof value.providerId === "number" &&
  typeof value.displayPriority === "number";

const parseProviders = (value: unknown): ProviderInfo[] => {
  if (value == null) return [];
  if (!Array.isArray(value) || !value.every(isProvider)) throw readError();
  return value;
};

const parseJsonValue = (raw: string) => {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw readError();
  }
};

// Zustand persist stores `{ state, version }`. The MMKV value is left in place.
const parsePersistedMovieStorage = (raw: string | undefined): MovieSnapshot => {
  if (raw == null || raw === "") return emptyMovieSnapshot();
  const parsed = parseJsonValue(raw);
  if (!isRecord(parsed)) throw readError();
  const state = "state" in parsed ? parsed.state : parsed;
  if (!isRecord(state)) throw readError();
  return {
    shows: parseShows(state.shows),
    tagArray: parseTags(state.tagArray),
    genreArray: parseStringArray(state.genreArray),
    streamingProviders: parseProviders(state.streamingProviders),
  };
};

const readMmkvMovieStorage = (userId: string) => {
  const userStorage = new MMKV({ id: `${userId}.storage` });
  return userStorage.getString("movie-storage");
};

type ShowRow = {
  id: number;
  title: string;
  poster_url: string | null;
  poster_colors: string | null;
  backdrop_url: string | null;
  release_date_epoch: number;
  date_added_epoch: number;
  genres: string;
  rating: number;
  tag_ids: string;
  exists_in_saved: number;
  streaming_date_added_epoch: number;
  streaming_provider_ids: string;
  watched: number | null;
  favorited: number | null;
};

type TagRow = {
  id: string;
  name: string;
  date_added: number;
  pos: number;
};

const showToParams = (userId: string, show: ShowItemType) => ({
  $user_id: userId,
  $id: show.id,
  $title: show.title,
  $poster_url: show.posterURL ?? null,
  $poster_colors: show.posterColors ? JSON.stringify(show.posterColors) : null,
  $backdrop_url: show.backdropURL ?? null,
  $release_date_epoch: show.releaseDateEpoch,
  $date_added_epoch: show.dateAddedEpoch,
  $genres: JSON.stringify(show.genres ?? []),
  $rating: show.rating ?? 0,
  $tag_ids: JSON.stringify(show.tags ?? []),
  $exists_in_saved: show.existsInSaved ? 1 : 0,
  $streaming_date_added_epoch: show.streaming?.dateAddedEpoch ?? 0,
  $streaming_provider_ids: JSON.stringify(show.streaming?.providers ?? []),
  $watched: show.watched ?? null,
  $favorited: show.favorited ?? null,
});

const rowToShow = (row: ShowRow): ShowItemType => ({
  id: row.id,
  title: row.title,
  posterURL: row.poster_url ?? undefined,
  posterColors: row.poster_colors ? parsePosterColors(parseJsonValue(row.poster_colors)) : undefined,
  backdropURL: row.backdrop_url ?? undefined,
  releaseDateEpoch: row.release_date_epoch,
  dateAddedEpoch: row.date_added_epoch,
  genres: parseStringArray(parseJsonValue(row.genres)),
  rating: row.rating,
  tags: parseStringArray(parseJsonValue(row.tag_ids)),
  existsInSaved: row.exists_in_saved === 1,
  streaming: {
    dateAddedEpoch: row.streaming_date_added_epoch,
    providers: parseNumberArray(parseJsonValue(row.streaming_provider_ids)),
  },
  watched: row.watched ?? undefined,
  favorited: row.favorited ?? undefined,
});

const writeMovieSnapshot = (
  userId: string,
  snapshot: MovieSnapshot,
  recordMigration: boolean
) => {
  const db = getMovieDatabase();
  db.withTransactionSync(() => {
    db.runSync("DELETE FROM shows WHERE user_id = ?", userId);
    db.runSync("DELETE FROM tags WHERE user_id = ?", userId);

    const insertShow = db.prepareSync(`
      INSERT INTO shows (
        user_id, id, title, poster_url, poster_colors, backdrop_url,
        release_date_epoch, date_added_epoch, genres, rating, tag_ids,
        exists_in_saved, streaming_date_added_epoch, streaming_provider_ids,
        watched, favorited
      ) VALUES (
        $user_id, $id, $title, $poster_url, $poster_colors, $backdrop_url,
        $release_date_epoch, $date_added_epoch, $genres, $rating, $tag_ids,
        $exists_in_saved, $streaming_date_added_epoch, $streaming_provider_ids,
        $watched, $favorited
      )
    `);
    const insertTag = db.prepareSync(`
      INSERT INTO tags (user_id, id, name, date_added, pos)
      VALUES ($user_id, $id, $name, $date_added, $pos)
    `);
    try {
      for (const show of snapshot.shows) {
        insertShow.executeSync(showToParams(userId, show));
      }
      for (const tag of snapshot.tagArray) {
        insertTag.executeSync({
          $user_id: userId,
          $id: tag.id,
          $name: tag.name,
          $date_added: tag.dateAdded,
          $pos: tag.pos,
        });
      }
    } finally {
      insertShow.finalizeSync();
      insertTag.finalizeSync();
    }

    db.runSync(
      `INSERT INTO user_movie_cache (user_id, genre_array, streaming_providers)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         genre_array = excluded.genre_array,
         streaming_providers = excluded.streaming_providers`,
      userId,
      JSON.stringify(snapshot.genreArray),
      JSON.stringify(snapshot.streamingProviders)
    );

    if (recordMigration) {
      db.runSync(
        `INSERT INTO movie_storage_migrations (user_id, migrated_at)
         VALUES (?, ?)
         ON CONFLICT(user_id) DO NOTHING`,
        userId,
        Date.now()
      );
    }
  });
};

export const saveMovieSnapshot = (userId: string, snapshot: MovieSnapshot) =>
  writeMovieSnapshot(userId, snapshot, false);

export const loadMovieSnapshot = (userId: string): MovieSnapshot => {
  const db = getMovieDatabase();
  const showRows = db.getAllSync<ShowRow>("SELECT * FROM shows WHERE user_id = ?", userId);
  const tagRows = db.getAllSync<TagRow>(
    "SELECT id, name, date_added, pos FROM tags WHERE user_id = ? ORDER BY pos ASC",
    userId
  );
  const cache = db.getFirstSync<{ genre_array: string; streaming_providers: string }>(
    "SELECT genre_array, streaming_providers FROM user_movie_cache WHERE user_id = ?",
    userId
  );

  return {
    shows: showRows.map(rowToShow),
    tagArray: tagRows.map((tag) => ({
      id: tag.id,
      name: tag.name,
      dateAdded: tag.date_added,
      pos: tag.pos,
    })),
    genreArray: cache ? parseStringArray(parseJsonValue(cache.genre_array)) : [],
    streamingProviders: cache ? parseProviders(parseJsonValue(cache.streaming_providers)) : [],
  };
};

export const migrateUserMovieStorage = (userId: string) => {
  const db = getMovieDatabase();
  const existing = db.getFirstSync<{ user_id: string }>(
    "SELECT user_id FROM movie_storage_migrations WHERE user_id = ?",
    userId
  );
  if (existing) return;

  const snapshot = parsePersistedMovieStorage(readMmkvMovieStorage(userId));
  writeMovieSnapshot(userId, snapshot, true);
};

export const migrateAllMovieStorage = (currentUserId: string | undefined) => {
  const userIds = new Set((getAllUsers() ?? []).map((user) => user.id));
  if (currentUserId) userIds.add(currentUserId);
  for (const userId of userIds) {
    migrateUserMovieStorage(userId);
  }
};

export const deleteUserMovies = (userId: string) => {
  const db = getMovieDatabase();
  db.withTransactionSync(() => {
    db.runSync("DELETE FROM shows WHERE user_id = ?", userId);
    db.runSync("DELETE FROM tags WHERE user_id = ?", userId);
    db.runSync("DELETE FROM user_movie_cache WHERE user_id = ?", userId);
    db.runSync("DELETE FROM movie_storage_migrations WHERE user_id = ?", userId);
  });
};

export { emptyMovieSnapshot };
