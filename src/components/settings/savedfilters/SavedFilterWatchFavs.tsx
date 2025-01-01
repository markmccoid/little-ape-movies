import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import useSettingsStore, {
  getInclusionIndex,
  getInclusionValue,
  useSettingsActions,
} from "@/store/store.settings";
type Props = {
  filterInfo: { watched: "off" | "include" | "exclude"; favorites: "off" | "include" | "exclude" };
  handleFavorites: (state: "off" | "include" | "exclude") => void;
  handleWatched: (state: "off" | "include" | "exclude") => void;
};
const SavedFilterWatchFavs = ({ filterInfo, handleFavorites, handleWatched }: Props) => {
  const [currFilter, setCurrFilter] = useState<Props["filterInfo"]>();

  useEffect(() => {
    setCurrFilter(filterInfo);
  }, [filterInfo]);
  return (
    <View>
      <SegmentedControl
        className="w-[100]"
        values={["Ignore", "Watched", "Unwatched"]}
        selectedIndex={getInclusionIndex(currFilter?.watched)}
        onChange={(event) => {
          const state = event.nativeEvent.selectedSegmentIndex;
          handleWatched(getInclusionValue(state as 0 | 1 | 2));
        }}
      />
      <View className="h-2" />
      <SegmentedControl
        className="w-[100]"
        values={["Ignore", "Favorites", "Exclude Favs"]}
        selectedIndex={getInclusionIndex(currFilter?.favorites)}
        onChange={(event) => {
          const state = event.nativeEvent.selectedSegmentIndex;
          handleFavorites(getInclusionValue(state as 0 | 1 | 2));
        }}
      />
    </View>
  );
};

export default SavedFilterWatchFavs;
