import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { MovieDetails } from "@/store/dataHooks";
import useDetailImageSize from "@/hooks/useDetailImageSize";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import AnimDetailImage from "./AnimDetailImage";

import MDDetailContextMenu from "./MDDetailContextMenu";
import MDBackground from "./MDBackground";
import { Sparkles } from "@/lib/icons/Sparkles";
import { Eye } from "@/lib/icons/Eye";
import { useCustomTheme } from "@/lib/colorThemes";
import { AnimatePresence, MotiView } from "moti";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails;
  storedMovie: ShowItemType | undefined;
};

const MDImageDescRow = ({ existsInSaved, movieDetails, storedMovie }: Props) => {
  const posterURL = storedMovie?.posterURL || movieDetails?.posterURL;
  const actions = useMovieActions();
  const { colors } = useCustomTheme();
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flexDirection: "row",
        justifyContent: existsInSaved ? "flex-start" : "flex-end",
      }}
    >
      <View className="flex-row flex-1 py-2 pl-2">
        <MDBackground />

        <MDDetailContextMenu
          shareLink={movieDetails?.imdbURL ? movieDetails?.imdbURL : movieDetails?.posterURL}
          movieId={storedMovie?.id || movieDetails?.id}
          movieTitle={storedMovie?.title || movieDetails?.title}
          existsInSaved={existsInSaved}
        >
          <View>
            <Pressable
              className="absolute z-10 bottom-[-5] left-[-5]"
              onPress={() => actions.toggleFavorited(storedMovie.id)}
            >
              <AnimatePresence>
                {storedMovie?.favorited && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.6 }}
                    transition={{ type: "timing", duration: 200 }}
                  >
                    <Sparkles fill="yellow" strokeWidth={1} className="color-black" size={22} />
                  </MotiView>
                )}
              </AnimatePresence>
            </Pressable>
            <Pressable
              className="absolute z-10 bottom-[-5] right-[-5]"
              onPress={() => actions.toggleWatched(storedMovie.id)}
            >
              <AnimatePresence>
                {storedMovie?.watched && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.6 }}
                    transition={{ type: "timing", duration: 200 }}
                  >
                    <Eye
                      fill={colors.includeGreen}
                      strokeWidth={1}
                      className="color-black"
                      size={22}
                    />
                  </MotiView>
                )}
              </AnimatePresence>
            </Pressable>
            <AnimDetailImage existsInSaved={existsInSaved} posterURL={posterURL} />
          </View>
        </MDDetailContextMenu>

        <View className="flex-1" key={2}>
          {movieDetails?.id ? (
            <Overview overview={movieDetails?.overview} />
          ) : (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const Overview = ({ overview }: { overview: string | undefined }) => {
  const { imageWidth, imageHeight } = useDetailImageSize();

  return (
    <ScrollView
      style={{ maxHeight: imageHeight, marginLeft: 8, marginRight: 3, paddingTop: 4 }}
      contentContainerStyle={{ paddingBottom: 10 }}
    >
      <Animated.Text
        style={{ fontSize: 16 }}
        // entering={FadeInRight.duration(700)}
      >
        {overview}
      </Animated.Text>
    </ScrollView>
    // <View className="border border-red-600">
    //   <Text lineBreakMode="tail" numberOfLines={5}>
    //     {overview}
    //   </Text>
    // </View>
  );
};

export default MDImageDescRow;
