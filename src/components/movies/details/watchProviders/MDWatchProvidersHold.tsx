import { View, Text, Image, ScrollView, FlatList } from "react-native";
import React, { useState } from "react";
import { useMovieWatchProviders } from "@/store/dataHooks";
import WatchProviderSection from "./WatchProviderSection";
import { ProviderInfo } from "@markmccoid/tmdb_api";
import { useSharedValue } from "react-native-reanimated";

type Props = {
  movieId: number;
};

interface WatchProviderSection {
  section: "stream" | "rent" | "buy";
  sectionTitle: string;
  order: number;
  sectionProviders: ProviderInfo[];
}

const MDWatchProviders = ({ movieId }: Props) => {
  const { watchProviders, isLoading } = useMovieWatchProviders(movieId);
  const scrollOffset = useSharedValue(0);

  if (isLoading) return null;
  if (!watchProviders) {
    return (
      <View>
        <Text>Not available to Stream, Rent or Buy</Text>
      </View>
    );
  }
  const watchProviderSectionArray = Object.keys(watchProviders || {})
    .map((key) => {
      if (key === "justWatchLink") return undefined;
      return {
        section: key,
        sectionTitle: key[0].toUpperCase() + key.slice(1),
        order: key.toLowerCase() === "stream" ? 1 : key.toLowerCase() === "rent" ? 2 : 3,
        sectionProviders: watchProviders[key as WatchProviderSection["section"]] as ProviderInfo[],
      };
    })
    .filter((el): el is WatchProviderSection => el !== undefined);

  return (
    <FlatList
      horizontal
      data={watchProviderSectionArray}
      keyExtractor={(item) => item.section}
      scrollEventThrottle={5}
      onScroll={(e) => {
        scrollOffset.value = e.nativeEvent.contentOffset.x < 0 ? 0 : e.nativeEvent.contentOffset.x;
      }}
      renderItem={({ item }) => (
        <WatchProviderSection
          sectionTitle={item.sectionTitle}
          watchProviders={item.sectionProviders}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default MDWatchProviders;
