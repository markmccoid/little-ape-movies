import { View, Text, ScrollView } from "react-native";
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
      <View className="flex-row flex-1">
        <Animated.View
          sharedTransitionTag="detailImage"
          key={1}
          layout={SequencedTransition.duration(700).reverse().reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.duration(700)}
          entering={FadeIn.duration(700)}
        >
          <MotiDetailImage existsInSaved={existsInSaved} posterURL={movieDetails?.posterURL} />
        </Animated.View>
        <Animated.View
          className="flex-1 ml-2"
          key={2}
          layout={SequencedTransition.duration(700).reverse().reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.duration(700)}
          entering={FadeIn.duration(700)}
        >
          <Overview overview={movieDetails?.overview} />
        </Animated.View>
      </View>
    </View>
  );
};

const Overview = ({ overview }: { overview: string | undefined }) => {
  return (
    <ScrollView>
      <Animated.Text entering={FadeInRight.duration(700)}>{overview}</Animated.Text>
    </ScrollView>
    // <View className="border border-red-600">
    //   <Text lineBreakMode="tail" numberOfLines={5}>
    //     {overview}
    //   </Text>
    // </View>
  );
};

export default MDImageDescRow;
