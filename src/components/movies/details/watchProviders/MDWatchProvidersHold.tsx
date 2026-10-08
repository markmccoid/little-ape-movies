import { View, Text, FlatList } from "react-native";
import React from "react";
import { useMovieWatchProviders } from "@/store/dataHooks";
import WatchProviderSection, { WatchProviderSectionItem } from "./WatchProviderSection";
import { useSharedValue } from "react-native-reanimated";

type Props = {
  movieId: number;
};

const MDWatchProviders = ({ movieId }: Props) => {
  const { watchProviders, isLoading } = useMovieWatchProviders(movieId);
  const scrollOffset = useSharedValue(0);

  if (isLoading) return null;
  if (!watchProviders || watchProviders.length === 0) {
    return (
      <View>
        <Text>Not available to Stream, Rent or Buy</Text>
      </View>
    );
  }

  const sectionItems: WatchProviderSectionItem[] = watchProviders.map((section) => ({
    type: section.type,
    title: section.title,
    providers: section.providers?.map((provider) => ({
      provider: provider.provider,
      logoURL: provider.logoURL,
      providerId: provider.providerId,
      displayPriority: provider.displayPriority,
    })),
  }));

  return (
    <FlatList
      horizontal
      data={sectionItems}
      keyExtractor={(item) => item.type}
      scrollEventThrottle={5}
      onScroll={(e) => {
        scrollOffset.value = e.nativeEvent.contentOffset.x < 0 ? 0 : e.nativeEvent.contentOffset.x;
      }}
      renderItem={({ item, index }) => (
        <WatchProviderSection
          item={item}
          index={index}
          scrollOffset={scrollOffset}
          watchProviders={sectionItems}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default MDWatchProviders;
