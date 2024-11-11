import useSettingsStore from "@/store/store.settings";
import useMovieStore, { Tag } from "@/store/store.shows";
import React, { useEffect, useState } from "react";

const useFilterTags = () => {
  const allTags = useMovieStore((state) => state.tagArray);
  const includeTags = useSettingsStore((state) => state.filterCriteria.includeTags);
  const excludeTags = useSettingsStore((state) => state.filterCriteria.excludeTags);
  const [mergedTags, setMergedTags] = useState(() =>
    getTagsWithState(allTags, includeTags, excludeTags)
  );

  useEffect(() => {
    setMergedTags(getTagsWithState(allTags, includeTags, excludeTags));
  }, [allTags, includeTags, excludeTags]);

  return mergedTags;
};

// -- Helper Function add state to tag object
function getTagsWithState(
  allTags: Tag[],
  includeTags: string[] = [], // assuming only the IDs of tags are stored here
  excludeTags: string[] = []
) {
  // Convert includeTags and excludeTags to Sets for O(1) lookup
  const includeTagSet = new Set(includeTags);
  const excludeTagSet = new Set(excludeTags);

  return allTags.map(({ id, name }) => {
    let state: "off" | "include" | "exclude" = "off";

    if (includeTagSet.has(id)) {
      state = "include";
    } else if (excludeTagSet.has(id)) {
      state = "exclude";
    }

    return { id, name, state };
  });
}

export default useFilterTags;
