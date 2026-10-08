import { View, Text, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useMovieWatchProviders, WatchProviderOnly } from "@/store/dataHooks";
import WatchProviderSection, { WatchProviderSectionItem } from "./WatchProviderSection";
import { ProviderInfo } from "@markmccoid/tmdb_api";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  movieId: number | undefined;
};

interface WatchProviderSection {
  section: "stream" | "rent" | "buy";
  sectionTitle: string;
  order: number;
  sectionProviders: ProviderInfo[];
}

const MDWatchProviders = ({ movieId }: Props) => {
  if (!movieId) return null;

  const { watchProviders, justWatchLink, isLoading } = useMovieWatchProviders(movieId);
  const scrollOffset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.x;
  });

  if (isLoading) return null;
  const watchProviderCount = watchProviders.reduce((total, section) => {
    const providers = section.providers;
    if (!providers) return total;
    return total + providers.length;
  }, 0);

  if (watchProviderCount === 0) {
    return (
      <View className="flex-row justify-center items-center">
        <Text>Not available to Stream, Rent or Buy</Text>
      </View>
    );
  }

  // Remove any groups that do NOT have any providers
  const finalWatchProviders = watchProviders.filter(
    (el): el is WatchProviderOnly & { providers: ProviderInfo[] } =>
      !!el.providers && el.providers.length > 0
  );
  const sectionItems: WatchProviderSectionItem[] = finalWatchProviders.map((section) => ({
    type: section.type,
    title: section.title,
    providers: section.providers.map((provider) => ({
      provider: provider.provider,
      logoURL: provider.logoURL,
      providerId: provider.providerId,
      displayPriority: provider.displayPriority,
    })),
  }));
  //! ------------
  //! Cramming this into the watch providers so that we get a "justWatch"
  //! icon at the end of the list that can be clicked on.
  //! NOTE: Custom code in WatchProviderSection.tsx to handle these fields
  //! ------------
  const justWatchProvider: WatchProviderSectionItem | undefined = justWatchLink
    ? {
        type: "justWatchLink",
        title: "JustWatch",
        providers: [
          {
            provider: "justWatch",
            logoURL: "https://www.justwatch.com/blog/images/icon.png",
            providerId: justWatchLink,
            displayPriority: 1000,
          },
        ],
      }
    : undefined;
  // console.log("WatchProv", finalWatchProviders);
  return (
    <View>
      <Animated.FlatList
        horizontal
        data={justWatchProvider ? [...sectionItems, justWatchProvider] : sectionItems}
        keyExtractor={(item) => item.type}
        renderItem={({ item, index }) => (
          // <ListItem item={item} index={index} scrollOffset={scrollOffset} />
          <WatchProviderSection
            item={item}
            index={index}
            scrollOffset={scrollOffset}
            watchProviders={sectionItems}
          />
        )}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      />
      {/* <TouchableOpacity onPress={async () => WebBrowser.openBrowserAsync(justWatchLink)}>
        <Text>JustWatch Site</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default MDWatchProviders;
