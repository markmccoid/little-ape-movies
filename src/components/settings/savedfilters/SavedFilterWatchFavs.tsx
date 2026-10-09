import { View } from "react-native";
import React from "react";
import InclusionPicker, {
  favoriteInclusionOptions,
  watchedInclusionOptions,
} from "@/components/common/InclusionPicker";
import { InclusionState } from "@/store/store.settings";

interface SavedFilterWatchFavsProps {
  filterInfo: { watched: InclusionState; favorites: InclusionState };
  handleFavorites: (state: InclusionState) => void;
  handleWatched: (state: InclusionState) => void;
}

const SavedFilterWatchFavs: React.FC<SavedFilterWatchFavsProps> = ({
  filterInfo,
  handleFavorites,
  handleWatched,
}) => {
  return (
    <View>
      <View className="mx-2">
        <InclusionPicker
          label="Watched"
          options={watchedInclusionOptions}
          value={filterInfo.watched}
          onChange={handleWatched}
        />
      </View>
      <View className="h-2" />
      <View className="mx-2">
        <InclusionPicker
          label="Favorites"
          options={favoriteInclusionOptions}
          value={filterInfo.favorites}
          onChange={handleFavorites}
        />
      </View>
    </View>
  );
};

export default SavedFilterWatchFavs;
