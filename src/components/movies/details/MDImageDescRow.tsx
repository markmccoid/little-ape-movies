import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { MovieDetails } from "@/store/dataHooks";
import useDetailImageSize from "@/hooks/useDetailImageSize";
import { ShowItemType } from "@/store/store.shows";
import AnimDetailImage from "./AnimDetailImage";

import * as ContextMenu from "zeego/context-menu";
import MDDetailContextMenu from "./MDDetailContextMenu";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails;
  storedMovie: ShowItemType | undefined;
};

const MDImageDescRow = ({ existsInSaved, movieDetails, storedMovie }: Props) => {
  const posterURL = storedMovie?.posterURL || movieDetails?.posterURL;

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flexDirection: "row",
        justifyContent: existsInSaved ? "flex-start" : "flex-end",
      }}
    >
      {/* {existsInSaved ? ( */}
      <View className="flex-row flex-1 py-2 pl-2">
        <View
          style={{
            backgroundColor: "white",
            opacity: 0.5,
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.4,
            shadowRadius: 2,
            ...StyleSheet.absoluteFillObject,
            position: "absolute",
          }}
        />
        {/* <View           key={1}        > */}
        <MDDetailContextMenu
          shareLink={movieDetails?.imdbURL ? movieDetails?.imdbURL : movieDetails?.posterURL}
          movieId={storedMovie?.id || movieDetails?.id}
          movieTitle={storedMovie?.title || movieDetails?.title}
        >
          <AnimDetailImage existsInSaved={existsInSaved} posterURL={posterURL} />
        </MDDetailContextMenu>
        {/* <ContextMenu.Root>
          <ContextMenu.Trigger>
            <AnimDetailImage existsInSaved={existsInSaved} posterURL={posterURL} />
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item key="author" onSelect={() => console.log("HERE")}>
              <ContextMenu.ItemTitle>Author</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon
                ios={{
                  name: "person",
                  pointSize: 18,
                  weight: "semibold",
                  scale: "medium",
                }}
              ></ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root> */}
        {/* </View> */}
        <View
          className="flex-1"
          key={2}
          // layout={SequencedTransition.duration(300).reverse().reduceMotion(ReduceMotion.Never)}
          // exiting={FadeOut.duration(300)}
          // entering={FadeIn.duration(300)}
        >
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
