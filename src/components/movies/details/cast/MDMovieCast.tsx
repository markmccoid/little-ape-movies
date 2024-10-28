import { View, Text } from "react-native";
import React from "react";

type Props = {
  movieId: number | undefined;
};

const MDMovieCast = ({ movieId }: Props) => {
  return (
    <View>
      <Text>MDMovieCast</Text>
    </View>
  );
};

export default MDMovieCast;
