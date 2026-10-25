export type MovieSearchDeepLink = {
  showId: string;
  title?: string;
};

const movieSearchPath = /(?:^|\/)search\/(\d+)$/;

const titleFromQuery = (search: string) => {
  const title = new URLSearchParams(search).get("title")?.trim();
  return title || undefined;
};

// `littleapemovies:///search/1204680` keeps "search" in the path.
// `littleapemovies://search/1204680` puts "search" in the host.
const fromUrl = (incoming: string): MovieSearchDeepLink | null => {
  const url = new URL(incoming);
  const title = titleFromQuery(url.search);
  const path = url.pathname.replace(/^\/+/, "");
  const pathMatch = path.match(movieSearchPath);
  if (pathMatch?.[1]) {
    return { showId: pathMatch[1], title };
  }
  if (url.hostname === "search" && /^\d+$/.test(path)) {
    return { showId: path, title };
  }
  return null;
};

export const parseMovieSearchDeepLink = (incoming: string): MovieSearchDeepLink | null => {
  try {
    return fromUrl(incoming);
  } catch {
    const [pathPart, queryPart = ""] = incoming.split("?");
    const pathMatch = pathPart?.match(movieSearchPath);
    if (!pathMatch?.[1]) return null;
    return { showId: pathMatch[1], title: titleFromQuery(queryPart) };
  }
};

// Keep the original scheme so Expo Router still treats this as an app link,
// but land on the search index instead of the detail route.
export const toSearchEntryUrl = (incoming: string, link: MovieSearchDeepLink) => {
  const params = new URLSearchParams({ deeplinkShowId: link.showId });
  if (link.title) params.set("deeplinkTitle", link.title);
  try {
    const url = new URL(incoming);
    if (url.hostname === "search") url.hostname = "";
    url.pathname = "/search";
    url.search = params.toString();
    url.hash = "";
    return url.toString();
  } catch {
    return `/search?${params.toString()}`;
  }
};
