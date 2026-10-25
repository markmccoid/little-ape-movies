import { useSearchStore } from "@/store/store.search";
import { parseMovieSearchDeepLink, toSearchEntryUrl } from "@/utils/movieDeepLink";

// A shared movie link looks like littleapemovies:///search/1204680?title=...
// Expo Router would open the detail route immediately, which skips the search
// screen and leaves nothing underneath for Back. Rewrite it to the search
// index and let that screen fill the query, then push the detail.
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const link = parseMovieSearchDeepLink(path);
    if (!link) return path;
    if (link.title) {
      const { setSearch, setSearchType } = useSearchStore.getState().actions;
      setSearchType("title");
      setSearch(link.title);
    }
    return toSearchEntryUrl(path, link);
  } catch {
    return path;
  }
}
