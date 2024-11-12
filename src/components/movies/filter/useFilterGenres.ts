import useSettingsStore from "@/store/store.settings";
import useMovieStore, { Tag } from "@/store/store.shows";
import React, { useEffect, useState } from "react";

const useFilterGenres = () => {
  const allGenres = useMovieStore((state) => state.genreArray);
  const includeGenres = useSettingsStore((state) => state.filterCriteria.includeGenres);
  const excludeGenres = useSettingsStore((state) => state.filterCriteria.excludeGenres);
  const [mergedGenres, setMergedGenres] = useState(() =>
    getGenresWithState(allGenres, includeGenres, excludeGenres)
  );

  useEffect(() => {
    setMergedGenres(getGenresWithState(allGenres, includeGenres, excludeGenres));
  }, [allGenres, includeGenres, excludeGenres]);

  return mergedGenres;
};

// -- Helper Function add state to tag object
function getGenresWithState(
  allGenres: string[],
  includeGenres: string[] = [], // assuming only the IDs of tags are stored here
  excludeGenres: string[] = []
) {
  // Convert includeTags and excludeTags to Sets for O(1) lookup
  const includeGenreSet = new Set(includeGenres);
  const excludeGenreSet = new Set(excludeGenres);

  return allGenres.map((genre) => {
    let state: "off" | "include" | "exclude" = "off";

    if (includeGenreSet.has(genre)) {
      state = "include";
    } else if (excludeGenreSet.has(genre)) {
      state = "exclude";
    }

    return { genre, state };
  });
}

export default useFilterGenres;
