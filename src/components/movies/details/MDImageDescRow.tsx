import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  ReduceMotion,
  SequencedTransition,
} from "react-native-reanimated";
import MotiDetailImage from "./MotiDetailImage";
import { MovieDetails } from "@/store/dataHooks";
import useDetailImageSize from "@/hooks/useDetailImageSize";

type Props = {
  existsInSaved: boolean;
  movieDetails: MovieDetails;
};

const MDImageDescRow = ({ existsInSaved, movieDetails }: Props) => {
  return (
    <View
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
        <View
          // sharedTransitionTag="detailImage"
          key={1}
          // layout={SequencedTransition.duration(300).reverse().reduceMotion(ReduceMotion.Never)}
          // exiting={FadeOut.duration(300)}
          // entering={FadeIn.duration(300)}
        >
          <MotiDetailImage existsInSaved={existsInSaved} posterURL={movieDetails?.posterURL} />
        </View>
        <View
          className="flex-1"
          key={2}
          // layout={SequencedTransition.duration(300).reverse().reduceMotion(ReduceMotion.Never)}
          // exiting={FadeOut.duration(300)}
          // entering={FadeIn.duration(300)}
        >
          <Overview overview={movieDetails?.overview} />
        </View>
      </View>
    </View>
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
