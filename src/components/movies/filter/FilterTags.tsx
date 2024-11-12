import { View } from "react-native";
import React from "react";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";
import useFilterTags from "./useFilterTags";
import { Text } from "@/components/ui/text";
import TagCloudEnhanced, {
  TagItem as TagItemEnhanced,
} from "@/components/common/TagCloud/TagCloudEnhanced";
import { tags } from "react-native-svg/lib/typescript/xml";

/**
 * Maybe when filtering, start by creating a full copy of the existing tags in the settings.store
 * but add a new key "state", which can be "off", "includeTag", "excludeTag"
 * Easy to update
 * When actually filtering, we would need to first read through this "filterTags" array and
 * create our "includeTags" and "excludeTags" arrays
 * PRO - no worries about duplicates in arrays or a tag being in both include/exclude arrays
 * ISSUES
 * Tricky part is when do we copy over the tags.  Has to only be once per filter session
 */
/**
 * SOLUTION
 * We will have a useTagsState() hook that pulls in the filterCriteria-> includeTags and excludeTags
 * It will merge with all tags and send back an object with tagId, tagName, tagState - "off", "include", "exclude"
 * This hook will update whenever tags or filterCriteria change
 *
 * Adding to the include/exclude tags will make sure that a tag doesn't exist in both
 * when adding a tag to the include array, we first will "remove" it(if it exists) from teh exclude array
 * and vice versa.
 */

const FilterTags = () => {
  const mergedTags = useFilterTags();
  const actions = useSettingsActions();

  // console.log("Merged", mergedTags);
  // Extract the type of the `state` property within each item of `mergedTags`
  type MergedTagState = (typeof mergedTags)[number]["state"];
  const handleTagSelect = (tagState: MergedTagState) => (tagId: string) => {
    // include -> exclude -> off
    if (tagState === "include") {
      actions.updateTagsFilter("exclude", tagId, "add");
      return;
    }
    if (tagState === "exclude") {
      actions.updateTagsFilter("exclude", tagId, "remove");
      return;
    }
    if (tagState === "off") {
      actions.updateTagsFilter("include", tagId, "add");
      return;
    }
  };

  const handleLongPress = (tagState: MergedTagState) => (tagId: string) => {
    // off -> exclude
    if (tagState === "off") {
      actions.updateTagsFilter("exclude", tagId, "add");
      return;
    }
    // exclude -> off, include -> off
    actions.updateTagsFilter("exclude", tagId, "remove");
    actions.updateTagsFilter("include", tagId, "remove");
  };
  return (
    <View>
      <TagCloudEnhanced>
        {mergedTags.map((tag) => (
          <TagItemEnhanced
            key={tag.id}
            tagId={tag.id}
            tagName={tag.name}
            size="s"
            state={tag.state}
            onToggleTag={handleTagSelect(tag.state)}
            onLongPress={handleLongPress(tag.state)}
          />
        ))}
      </TagCloudEnhanced>
    </View>
  );
};

export default FilterTags;
