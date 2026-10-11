export type { PendingChanges, ShowItemType, Tag, TagState } from "./movieTypes";
export { updateTagState } from "./movieTypes";
export { useGenres, useGetAppliedTags, useMovieActions, useMovies, useShow, useTags } from "./movieLibrary";

import useMovieUiStore from "./store.movieUi";

// Movie rows live in SQLite. This store only tracks UI that should not be saved
// on every tap: the open action bar's pending edits, and the debug overlay.
const useMovieStore = useMovieUiStore;

export default useMovieStore;
