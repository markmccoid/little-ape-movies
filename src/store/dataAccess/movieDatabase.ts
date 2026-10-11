import { MMKV } from "react-native-mmkv";
import * as SQLite from "expo-sqlite";
import type { SQLiteBindValue } from "expo-sqlite";
import type { ProviderInfo } from "@markmccoid/tmdb_api";
import type { ShowItemType, Tag } from "@/store/movieTypes";
import { getAllUsers } from "./localStorage-users";
import type { ImageColors } from "@/utils/color.utils";

const DATABASE_NAME = "little-ape-movies.db";

let database: SQLite.SQLiteDatabase | undefined;
let transactionDepth = 0;

const getMovieDatabase = () => {
  if (database) return database;
  const db = SQLite.openDatabaseSync(DATABASE_NAME);
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
  ensureSchema(db);
  database = db;
  return db;
};

// Joins an already-open transaction. SQLite rejects a nested BEGIN.
export const withMovieTransaction = (task: () => void) => {
  const db = getMovieDatabase();
  if (transactionDepth > 0) {
    task();
    return;
  }
  transactionDepth += 1;
  try {
    db.withTransactionSync(task);
  } finally {
    transactionDepth -= 1;
  }
};

const columnNames = (db: SQLite.SQLiteDatabase, table: string) =>
  db.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`).map((column) => column.name);

const tableExists = (db: SQLite.SQLiteDatabase, table: string) =>
  db.getFirstSync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    table
  ) != null;

// Existing installs stored tags and genres as JSON columns. New installs
// create the link tables directly. Either way, reads and writes use the links.
const ensureSchema = (db: SQLite.SQLiteDatabase) => {
  if (!tableExists(db, "shows")) {
    db.execSync(`
      CREATE TABLE shows (
        user_id TEXT NOT NULL,
        id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_url TEXT,
        poster_colors TEXT,
        backdrop_url TEXT,
        release_date_epoch INTEGER NOT NULL,
        date_added_epoch INTEGER NOT NULL,
        rating REAL NOT NULL,
        exists_in_saved INTEGER NOT NULL,
        streaming_date_added_epoch INTEGER NOT NULL,
        streaming_provider_ids TEXT NOT NULL,
        watched INTEGER,
        favorited INTEGER,
        PRIMARY KEY (user_id, id)
      );
    `);
  }

  db.execSync(`
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
      streaming_providers TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movie_storage_migrations (
      user_id TEXT PRIMARY KEY NOT NULL,
      migrated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS show_tags (
      user_id TEXT NOT NULL,
      show_id INTEGER NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (user_id, show_id, tag_id),
      FOREIGN KEY (user_id, show_id) REFERENCES shows (user_id, id) ON DELETE CASCADE,
      FOREIGN KEY (user_id, tag_id) REFERENCES tags (user_id, id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS show_tags_by_tag ON show_tags (user_id, tag_id);
    CREATE TABLE IF NOT EXISTS show_genres (
      user_id TEXT NOT NULL,
      show_id INTEGER NOT NULL,
      genre TEXT NOT NULL,
      PRIMARY KEY (user_id, show_id, genre),
      FOREIGN KEY (user_id, show_id) REFERENCES shows (user_id, id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS show_genres_by_genre ON show_genres (user_id, genre);
  `);

  const showColumns = columnNames(db, "shows");
  if (showColumns.includes("tag_ids")) {
    db.execSync(`
      INSERT OR IGNORE INTO show_tags (user_id, show_id, tag_id)
        SELECT s.user_id, s.id, j.value
        FROM shows s, json_each(s.tag_ids) j
        WHERE EXISTS (SELECT 1 FROM tags t WHERE t.user_id = s.user_id AND t.id = j.value);
    `);
    db.execSync("ALTER TABLE shows DROP COLUMN tag_ids");
  }
  if (showColumns.includes("genres")) {
    db.execSync(`
      INSERT OR IGNORE INTO show_genres (user_id, show_id, genre)
        SELECT s.user_id, s.id, j.value FROM shows s, json_each(s.genres) j;
    `);
    db.execSync("ALTER TABLE shows DROP COLUMN genres");
  }

  if (columnNames(db, "user_movie_cache").includes("genre_array")) {
    db.execSync("ALTER TABLE user_movie_cache DROP COLUMN genre_array");
  }
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

const parseJsonValue = (raw: string) => {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw readError();
  }
};

const parseShows = (value: unknown): ShowItemType[] => {
  if (value == null) return [];
  if (!Array.isArray(value)) throw readError();
  return value.map((item) => {
    if (!isRecord(item) || typeof item.id !== "number" || typeof item.title !== "string") {
      throw readError();
    }
    const streaming = isRecord(item.streaming) ? item.streaming : undefined;
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
      streaming: {
        dateAddedEpoch: optionalNumber(streaming?.dateAddedEpoch) ?? 0,
        providers: parseNumberArray(streaming?.providers),
      },
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
    return { id: item.id, name: item.name, dateAdded: item.dateAdded, pos: item.pos };
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

type LegacySnapshot = {
  shows: ShowItemType[];
  tagArray: Tag[];
  streamingProviders: ProviderInfo[];
};

const parsePersistedMovieStorage = (raw: string | undefined): LegacySnapshot => {
  if (raw == null || raw === "") return { shows: [], tagArray: [], streamingProviders: [] };
  const parsed = parseJsonValue(raw);
  if (!isRecord(parsed)) throw readError();
  const state = "state" in parsed ? parsed.state : parsed;
  if (!isRecord(state)) throw readError();
  return {
    shows: parseShows(state.shows),
    tagArray: parseTags(state.tagArray),
    streamingProviders: parseProviders(state.streamingProviders),
  };
};

type ShowRow = {
  id: number;
  title: string;
  poster_url: string | null;
  poster_colors: string | null;
  backdrop_url: string | null;
  release_date_epoch: number;
  date_added_epoch: number;
  rating: number;
  tag_ids: string | null;
  genres: string | null;
  exists_in_saved: number;
  streaming_date_added_epoch: number;
  streaming_provider_ids: string;
  watched: number | null;
  favorited: number | null;
};

const SHOW_SELECT = `
  SELECT
    s.id, s.title, s.poster_url, s.poster_colors, s.backdrop_url,
    s.release_date_epoch, s.date_added_epoch, s.rating, s.exists_in_saved,
    s.streaming_date_added_epoch, s.streaming_provider_ids, s.watched, s.favorited,
    (SELECT json_group_array(tag_id) FROM (
      SELECT st.tag_id FROM show_tags st
      JOIN tags t ON t.user_id = st.user_id AND t.id = st.tag_id
      WHERE st.user_id = s.user_id AND st.show_id = s.id
      ORDER BY t.pos
    )) AS tag_ids,
    (SELECT json_group_array(genre) FROM (
      SELECT sg.genre FROM show_genres sg
      WHERE sg.user_id = s.user_id AND sg.show_id = s.id
      ORDER BY sg.genre
    )) AS genres
  FROM shows s
`;

const rowToShow = (row: ShowRow): ShowItemType => ({
  id: row.id,
  title: row.title,
  posterURL: row.poster_url ?? undefined,
  posterColors: row.poster_colors ? parsePosterColors(parseJsonValue(row.poster_colors)) : undefined,
  backdropURL: row.backdrop_url ?? undefined,
  releaseDateEpoch: row.release_date_epoch,
  dateAddedEpoch: row.date_added_epoch,
  genres: row.genres ? parseStringArray(parseJsonValue(row.genres)) : [],
  rating: row.rating,
  tags: row.tag_ids ? parseStringArray(parseJsonValue(row.tag_ids)) : [],
  existsInSaved: row.exists_in_saved === 1,
  streaming: {
    dateAddedEpoch: row.streaming_date_added_epoch,
    providers: parseNumberArray(parseJsonValue(row.streaming_provider_ids)),
  },
  watched: row.watched ?? undefined,
  favorited: row.favorited ?? undefined,
});

export const getShow = (userId: string, showId: number): ShowItemType | null => {
  const row = getMovieDatabase().getFirstSync<ShowRow>(
    `${SHOW_SELECT} WHERE s.user_id = ? AND s.id = ?`,
    userId,
    showId
  );
  return row ? rowToShow(row) : null;
};

export type InclusionFilter = "off" | "include" | "exclude";
export type SortableShowField =
  | "title"
  | "rating"
  | "releaseDateEpoch"
  | "dateAddedEpoch"
  | "watched"
  | "favorited";

export type ShowListQuery = {
  titleSearch?: string;
  titleSearchScope: "all" | "filteronly";
  watched: InclusionFilter;
  favorited: InclusionFilter;
  includeTags: string[];
  excludeTags: string[];
  includeGenres: string[];
  excludeGenres: string[];
  sort: { field: SortableShowField; direction: "asc" | "desc" }[];
};

const SORT_COLUMNS: Record<SortableShowField, string> = {
  title: "s.title COLLATE NOCASE",
  rating: "s.rating",
  releaseDateEpoch: "s.release_date_epoch",
  dateAddedEpoch: "s.date_added_epoch",
  watched: "s.watched",
  favorited: "s.favorited",
};

const placeholders = (count: number) => Array.from({ length: count }, () => "?").join(", ");
const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

const nullableDateClause = (column: string, filter: InclusionFilter) => {
  switch (filter) {
    case "off":
      return undefined;
    case "include":
      return `${column} IS NOT NULL`;
    case "exclude":
      return `${column} IS NULL`;
    default: {
      const unhandled: never = filter;
      throw new Error(`Unhandled filter ${unhandled}`);
    }
  }
};

const buildShowListSql = (query: ShowListQuery) => {
  const where = ["s.user_id = ?"];
  const params: SQLiteBindValue[] = [];
  const titleSearch = query.titleSearch?.trim();

  if (titleSearch) {
    where.push("s.title LIKE ? ESCAPE '\\'");
    params.push(`%${escapeLike(titleSearch)}%`);
  }

  if (!titleSearch || query.titleSearchScope === "filteronly") {
    const watched = nullableDateClause("s.watched", query.watched);
    if (watched) where.push(watched);
    const favorited = nullableDateClause("s.favorited", query.favorited);
    if (favorited) where.push(favorited);

    for (const tagId of query.includeTags) {
      where.push(
        `EXISTS (
          SELECT 1 FROM show_tags st
          WHERE st.user_id = s.user_id AND st.show_id = s.id AND st.tag_id = ?
        )`
      );
      params.push(tagId);
    }
    if (query.excludeTags.length > 0) {
      where.push(
        `NOT EXISTS (
          SELECT 1 FROM show_tags st
          WHERE st.user_id = s.user_id AND st.show_id = s.id
            AND st.tag_id IN (${placeholders(query.excludeTags.length)})
        )`
      );
      params.push(...query.excludeTags);
    }
    for (const genre of query.includeGenres) {
      where.push(
        `EXISTS (
          SELECT 1 FROM show_genres sg
          WHERE sg.user_id = s.user_id AND sg.show_id = s.id AND sg.genre = ?
        )`
      );
      params.push(genre);
    }
    if (query.excludeGenres.length > 0) {
      where.push(
        `NOT EXISTS (
          SELECT 1 FROM show_genres sg
          WHERE sg.user_id = s.user_id AND sg.show_id = s.id
            AND sg.genre IN (${placeholders(query.excludeGenres.length)})
        )`
      );
      params.push(...query.excludeGenres);
    }
  }

  const orderBy = query.sort.flatMap(({ field, direction }) => {
    const column = SORT_COLUMNS[field];
    if (!column) return [];
    const nulls = direction === "asc" ? "NULLS FIRST" : "NULLS LAST";
    return [`${column} ${direction === "asc" ? "ASC" : "DESC"} ${nulls}`];
  });
  orderBy.push("s.id ASC");

  return {
    sql: `${SHOW_SELECT} WHERE ${where.join(" AND ")} ORDER BY ${orderBy.join(", ")}`,
    params,
  };
};

export const listShows = (userId: string, query: ShowListQuery): ShowItemType[] => {
  const { sql, params } = buildShowListSql(query);
  return getMovieDatabase()
    .getAllSync<ShowRow>(sql, [userId, ...params])
    .map(rowToShow);
};

export const listSavedShowIds = (userId: string): number[] =>
  getMovieDatabase()
    .getAllSync<{ id: number }>(
      "SELECT id FROM shows WHERE user_id = ? AND exists_in_saved = 1",
      userId
    )
    .map((row) => row.id);

const writeShowGenres = (
  db: SQLite.SQLiteDatabase,
  userId: string,
  showId: number,
  genres: string[]
) => {
  db.runSync("DELETE FROM show_genres WHERE user_id = ? AND show_id = ?", userId, showId);
  for (const genre of new Set(genres)) {
    db.runSync(
      "INSERT INTO show_genres (user_id, show_id, genre) VALUES (?, ?, ?)",
      userId,
      showId,
      genre
    );
  }
};

const writeShowTags = (
  db: SQLite.SQLiteDatabase,
  userId: string,
  showId: number,
  tagIds: string[]
) => {
  db.runSync("DELETE FROM show_tags WHERE user_id = ? AND show_id = ?", userId, showId);
  for (const tagId of new Set(tagIds)) {
    db.runSync(
      `INSERT INTO show_tags (user_id, show_id, tag_id)
       SELECT ?, ?, ?
       WHERE EXISTS (SELECT 1 FROM tags WHERE user_id = ? AND id = ?)`,
      userId,
      showId,
      tagId,
      userId,
      tagId
    );
  }
};

const insertShowRow = (db: SQLite.SQLiteDatabase, userId: string, show: ShowItemType) => {
  const result = db.runSync(
    `INSERT INTO shows (
      user_id, id, title, poster_url, poster_colors, backdrop_url,
      release_date_epoch, date_added_epoch, rating, exists_in_saved,
      streaming_date_added_epoch, streaming_provider_ids, watched, favorited
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, id) DO NOTHING`,
    userId,
    show.id,
    show.title,
    show.posterURL ?? null,
    show.posterColors ? JSON.stringify(show.posterColors) : null,
    show.backdropURL ?? null,
    show.releaseDateEpoch,
    show.dateAddedEpoch,
    show.rating ?? 0,
    show.existsInSaved ? 1 : 0,
    show.streaming?.dateAddedEpoch ?? 0,
    JSON.stringify(show.streaming?.providers ?? []),
    show.watched ?? null,
    show.favorited ?? null
  );
  if (result.changes === 0) return false;
  writeShowGenres(db, userId, show.id, show.genres ?? []);
  writeShowTags(db, userId, show.id, show.tags ?? []);
  return true;
};

export const insertShow = (userId: string, show: ShowItemType) => {
  const db = getMovieDatabase();
  let inserted = false;
  withMovieTransaction(() => {
    inserted = insertShowRow(db, userId, show);
  });
  return inserted;
};

export const deleteShow = (userId: string, showId: number) => {
  getMovieDatabase().runSync("DELETE FROM shows WHERE user_id = ? AND id = ?", userId, showId);
};

export type ShowFieldPatch = Partial<Omit<ShowItemType, "id" | "tags" | "genres">>;

const patchToColumns = (patch: ShowFieldPatch): [string, SQLiteBindValue][] => {
  const columns: [string, SQLiteBindValue][] = [];
  if ("title" in patch) columns.push(["title", patch.title ?? ""]);
  if ("posterURL" in patch) columns.push(["poster_url", patch.posterURL ?? null]);
  if ("posterColors" in patch) {
    columns.push(["poster_colors", patch.posterColors ? JSON.stringify(patch.posterColors) : null]);
  }
  if ("backdropURL" in patch) columns.push(["backdrop_url", patch.backdropURL ?? null]);
  if ("releaseDateEpoch" in patch) columns.push(["release_date_epoch", patch.releaseDateEpoch ?? 0]);
  if ("dateAddedEpoch" in patch) columns.push(["date_added_epoch", patch.dateAddedEpoch ?? 0]);
  if ("rating" in patch) columns.push(["rating", patch.rating ?? 0]);
  if ("existsInSaved" in patch) columns.push(["exists_in_saved", patch.existsInSaved ? 1 : 0]);
  if ("streaming" in patch) {
    columns.push(["streaming_date_added_epoch", patch.streaming?.dateAddedEpoch ?? 0]);
    columns.push(["streaming_provider_ids", JSON.stringify(patch.streaming?.providers ?? [])]);
  }
  if ("watched" in patch) columns.push(["watched", patch.watched ?? null]);
  if ("favorited" in patch) columns.push(["favorited", patch.favorited ?? null]);
  return columns;
};

export const updateShowFields = (userId: string, showId: number, patch: ShowFieldPatch) => {
  const columns = patchToColumns(patch);
  if (columns.length === 0) return;
  getMovieDatabase().runSync(
    `UPDATE shows SET ${columns.map(([column]) => `${column} = ?`).join(", ")}
     WHERE user_id = ? AND id = ?`,
    [...columns.map(([, value]) => value), userId, showId]
  );
};

export const setShowTags = (userId: string, showId: number, tagIds: string[]) => {
  const db = getMovieDatabase();
  withMovieTransaction(() => writeShowTags(db, userId, showId, tagIds));
};

export const setShowGenres = (userId: string, showId: number, genres: string[]) => {
  const db = getMovieDatabase();
  withMovieTransaction(() => writeShowGenres(db, userId, showId, genres));
};

type TagRow = { id: string; name: string; date_added: number; pos: number };

export const listTags = (userId: string): Tag[] =>
  getMovieDatabase()
    .getAllSync<TagRow>(
      "SELECT id, name, date_added, pos FROM tags WHERE user_id = ? ORDER BY pos ASC, rowid ASC",
      userId
    )
    .map((tag) => ({ id: tag.id, name: tag.name, dateAdded: tag.date_added, pos: tag.pos }));

export const insertTag = (userId: string, tag: Tag) => {
  getMovieDatabase().runSync(
    "INSERT INTO tags (user_id, id, name, date_added, pos) VALUES (?, ?, ?, ?, ?)",
    userId,
    tag.id,
    tag.name,
    tag.dateAdded,
    tag.pos
  );
};

export const renameTag = (userId: string, tagId: string, name: string) => {
  getMovieDatabase().runSync(
    "UPDATE tags SET name = ? WHERE user_id = ? AND id = ?",
    name,
    userId,
    tagId
  );
};

export const deleteTag = (userId: string, tagId: string) => {
  getMovieDatabase().runSync("DELETE FROM tags WHERE user_id = ? AND id = ?", userId, tagId);
};

export const setTagPositions = (userId: string, orderedTagIds: string[]) => {
  const db = getMovieDatabase();
  withMovieTransaction(() => {
    orderedTagIds.forEach((tagId, pos) => {
      db.runSync("UPDATE tags SET pos = ? WHERE user_id = ? AND id = ?", pos, userId, tagId);
    });
  });
};

export const listGenres = (userId: string): string[] =>
  getMovieDatabase()
    .getAllSync<{ genre: string }>(
      "SELECT DISTINCT genre FROM show_genres WHERE user_id = ? ORDER BY genre COLLATE NOCASE",
      userId
    )
    .map((row) => row.genre);

export const listStreamingProviders = (userId: string): ProviderInfo[] => {
  const row = getMovieDatabase().getFirstSync<{ streaming_providers: string }>(
    "SELECT streaming_providers FROM user_movie_cache WHERE user_id = ?",
    userId
  );
  return row ? parseProviders(parseJsonValue(row.streaming_providers)) : [];
};

export const saveStreamingProviders = (userId: string, providers: ProviderInfo[]) => {
  getMovieDatabase().runSync(
    `INSERT INTO user_movie_cache (user_id, streaming_providers) VALUES (?, ?)
     ON CONFLICT(user_id) DO UPDATE SET streaming_providers = excluded.streaming_providers`,
    userId,
    JSON.stringify(providers)
  );
};

const importLegacySnapshot = (userId: string, snapshot: LegacySnapshot) => {
  const db = getMovieDatabase();
  withMovieTransaction(() => {
    db.runSync("DELETE FROM shows WHERE user_id = ?", userId);
    db.runSync("DELETE FROM tags WHERE user_id = ?", userId);
    for (const tag of snapshot.tagArray) insertTag(userId, tag);
    for (const show of snapshot.shows) insertShowRow(db, userId, show);
    saveStreamingProviders(userId, snapshot.streamingProviders);
    db.runSync(
      `INSERT INTO movie_storage_migrations (user_id, migrated_at) VALUES (?, ?)
       ON CONFLICT(user_id) DO NOTHING`,
      userId,
      Date.now()
    );
  });
};

export const migrateUserMovieStorage = (userId: string) => {
  const db = getMovieDatabase();
  const existing = db.getFirstSync<{ user_id: string }>(
    "SELECT user_id FROM movie_storage_migrations WHERE user_id = ?",
    userId
  );
  if (existing) return;
  const userStorage = new MMKV({ id: `${userId}.storage` });
  importLegacySnapshot(userId, parsePersistedMovieStorage(userStorage.getString("movie-storage")));
};

export const migrateAllMovieStorage = (currentUserId: string | undefined) => {
  const userIds = new Set((getAllUsers() ?? []).map((user) => user.id));
  if (currentUserId) userIds.add(currentUserId);
  for (const userId of userIds) migrateUserMovieStorage(userId);
};

export const deleteUserMovies = (userId: string) => {
  const db = getMovieDatabase();
  withMovieTransaction(() => {
    db.runSync("DELETE FROM shows WHERE user_id = ?", userId);
    db.runSync("DELETE FROM tags WHERE user_id = ?", userId);
    db.runSync("DELETE FROM user_movie_cache WHERE user_id = ?", userId);
    db.runSync("DELETE FROM movie_storage_migrations WHERE user_id = ?", userId);
  });
};
