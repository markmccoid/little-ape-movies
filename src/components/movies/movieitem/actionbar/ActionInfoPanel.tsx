import { View, Text, ScrollView } from "react-native";
import React from "react";
import { ShowItemType } from "@/store/store.shows";
import dayjs from "dayjs";

type Props = {
  movie: ShowItemType;
};
const ActionInfoPanel = ({ movie }: Props) => {
  return (
    <ScrollView className="px-2" contentContainerClassName="mb-10">
      <Text>Date Added: {dayjs.unix(movie.dateAddedEpoch).format("MM-DD-YYYY")}</Text>
      <Text>Date Rel: {dayjs.unix(movie.releaseDateEpoch).format("MM-DD-YYYY")}</Text>
      <Text>
        Date Epochs Add/Rel: {movie.dateAddedEpoch} / {movie.releaseDateEpoch}
      </Text>
    </ScrollView>
  );
};

export default ActionInfoPanel;
