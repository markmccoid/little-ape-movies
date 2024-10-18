import { View, Text, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useMovieWatchProviders } from "@/store/dataHooks";
import WatchProviderSection from "./WatchProviderSection";
import { ProviderInfo } from "@markmccoid/tmdb_api";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";

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
  const { watchProviders, justWatchLink, isLoading } = useMovieWatchProviders(movieId);

  const scrollOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.x;
  });

  if (isLoading) return null;
  const watchProviderCount = watchProviders.reduce(
    (fin, el) => fin + el?.providers?.length || 0,
    0
  );

  if (watchProviderCount === 0) {
    return (
      <View className="flex-row justify-center items-center">
        <Text>Not available to Stream, Rent or Buy</Text>
      </View>
    );
  }

  // Remove any groups that do NOT have any providers
  const finalWatchProviders = watchProviders.filter(
    (el) => el?.providers && el?.providers.length > 0
  );
  // console.log("WatchProv", finalWatchProviders);
  return (
    <View>
      <Animated.FlatList
        horizontal
        data={finalWatchProviders}
        keyExtractor={(item) => item.type}
        renderItem={({ item, index }) => (
          // <ListItem item={item} index={index} scrollOffset={scrollOffset} />
          <WatchProviderSection
            item={item}
            index={index}
            scrollOffset={scrollOffset}
            watchProviders={finalWatchProviders}
          />
        )}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      />
      <TouchableOpacity onPress={async () => WebBrowser.openBrowserAsync(justWatchLink)}>
        <Text>JustWatch Site</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MDWatchProviders;
