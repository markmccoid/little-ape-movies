import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCustomTheme } from "@/lib/colorThemes";
import { useRatingsTier } from "@/store/store.settings";
import * as Linking from "expo-linking";

type Props = {
  rating: string | undefined;
  votes: string | undefined;
  imdbId: string | undefined;
};
const IMDBRating = ({ rating, votes, imdbId }: Props) => {
  const { finalRating, ratingColor } = useRatingsTier(rating, "imdb");
  const { colors } = useCustomTheme();
  const imdbColor = colors.imdbYellow;
  const imdbRatingURL = `https://www.imdb.com/title/${imdbId}/ratings/`;
  return (
    <View className="flex-row justify-center">
      <TouchableOpacity
        onPress={async () => {
          Linking.openURL(imdbRatingURL).catch((err) =>
            console.log("Error opening imdbRatingURL", err)
          );
        }}
        style={{ paddingTop: 5 }}
      >
        <View
          className="p-1 items-center border-hairline rounded-md"
          style={{ backgroundColor: `${ratingColor}aa`, borderColor: imdbColor }}
        >
          <Text className="text-base font-semibold">{finalRating}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default IMDBRating;
