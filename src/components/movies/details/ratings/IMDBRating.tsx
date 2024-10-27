import { View, Text } from "react-native";
import React from "react";

type Props = {
  rating: string | undefined;
  votes: string | undefined;
};
const IMDBRating = ({ rating, votes }: Props) => {
  if (!rating) return null;

  const imdbColor = "#ECC233";
  const notGoodColor = "#AC831Faa";
  const goodColor = "#579C31aa";
  const bgColor = parseInt(rating) < 6 ? notGoodColor : goodColor;
  return (
    <View
      className="border p-1 rounded-md"
      style={{ backgroundColor: bgColor, borderColor: imdbColor }}
    >
      <Text>{rating}</Text>
    </View>
  );
};

export default IMDBRating;
