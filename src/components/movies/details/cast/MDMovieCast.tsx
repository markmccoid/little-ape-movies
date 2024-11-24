import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useState } from "react";
import { useMovieCast } from "@/store/dataHooks";
import CastMember from "./CastMember";

const { width, height } = Dimensions.get("window");
type Props = {
  movieId: number | undefined;
};

const MDMovieCast = ({ movieId }: Props) => {
  const { data, isLoading } = useMovieCast(movieId);

  if (!movieId || isLoading) return null;

  return (
    // <ScrollView style={{ height: (height / 3) * 2, paddingTop: 10 }}>
    // <ScrollView style={{ height: (height / 3) * 2, paddingTop: 10 }}>
    <View className="flex-row flex-wrap mx-[5]">
      {data &&
        data.map((el) => {
          return <CastMember key={el.creditId} castInfo={el} />;
        })}
    </View>
    // </ScrollView>
  );
};

export default MDMovieCast;
