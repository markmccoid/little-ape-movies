import { ActivityIndicator, View, Dimensions } from "react-native";
import React, { useState } from "react";
import { useMovieCast } from "@/store/dataHooks";
import CastMember from "./CastMember";
import FetchNotice from "@/components/common/FetchNotice";

const { width, height } = Dimensions.get("window");
type Props = {
  movieId: number | undefined;
};

const MDMovieCast = ({ movieId }: Props) => {
  const { data, isLoading, isError } = useMovieCast(movieId);

  if (!movieId) return null;
  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) return <FetchNotice message="Couldn't load cast." />;

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
