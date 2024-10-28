import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRatingsTier } from "@/store/store.settings";
import * as Linking from "expo-linking";

type Props = {
  metascore: string | undefined;
  imdbId: string | undefined;
};
const Metascore = ({ metascore, imdbId }: Props) => {
  const { finalRating, ratingColor } = useRatingsTier(metascore, "metascore");
  const metascoreURL = `https://www.imdb.com/title/${imdbId}/criticreviews`;

  return (
    <View className="flex-row justify-center">
      <TouchableOpacity
        onPress={async () => {
          Linking.openURL(metascoreURL).catch((err) =>
            console.log("Error opening WatchProvider", err)
          );
        }}
        style={{ paddingTop: 5 }}
      >
        <View
          className="p-1 items-center border-hairline rounded-md"
          style={{ backgroundColor: ratingColor }}
        >
          <Text className="text-base">{finalRating}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Metascore;
