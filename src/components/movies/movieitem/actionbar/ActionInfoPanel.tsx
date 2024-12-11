import { View, Text } from "react-native";
import React from "react";
import { ShowItemType } from "@/store/store.shows";
import dayjs from "dayjs";

type Props = {
  movie: ShowItemType;
};
const ActionInfoPanel = ({ movie }: Props) => {
  return (
    <View className="mt-2 px-2">
      <Text>Date Added: {dayjs.unix(movie.dateAddedEpoch).format("MM-DD-YYYY")}</Text>
      <Text>Date Added: {movie.releaseDateEpoch}</Text>
      <Text>Date Added: {movie.dateAddedEpoch}</Text>
    </View>
  );
};

export default ActionInfoPanel;
