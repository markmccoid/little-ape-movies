import { View, Text, Image } from "react-native";
import React from "react";
import { useRatingsTier } from "@/store/store.settings";

type Props = {
  rating: string | undefined;
  score: string | undefined;
};
const RottenTomatoes = ({ rating, score }: Props) => {
  if (!rating) return null;

  return (
    <View className="flex-row items-center py-1">
      {rating === "Fresh" ? (
        <Image
          source={require("../../../../../assets/images/fresh2.png")}
          style={{
            width: 25,
            height: 25,
          }}
        />
      ) : (
        <Image
          source={require("../../../../../assets/images/rotten.png")}
          style={{
            width: 25,
            height: 25,
          }}
        />
      )}
      <Text className="ml-[2]  text-base pt-1">{score}</Text>
    </View>
  );
};

export default RottenTomatoes;
