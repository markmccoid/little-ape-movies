import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import HiddenContainerAnimated from "@/components/common/HiddenContainer/HiddenContainerAnimated";
import MDMovieRecommendations from "./MDMovieRecommendations";
import HiddenContainerWatchProviders from "@/components/common/HiddenContainer/HiddenContainerWatchProviders";
import MDWatchProviders from "./watchProviders/MDWatchProviders";
import MDMovieVideos from "./MDMovieVideos";
import MDMovieCast from "./cast/MDMovieCast";
import useImageSize from "@/hooks/useImageSize";

const MovieDetailsHiddenContainers = ({ movieId }) => {
  const { imageHeight } = useImageSize(3);

  return (
    <>
      <View className="my-[2]">
        <HiddenContainerWatchProviders title="Where to Watch" movieId={movieId} height={85}>
          <MDWatchProviders movieId={movieId} />
        </HiddenContainerWatchProviders>
      </View>
      {/* RECOMMENDATIONS */}
      <View className="flex-1 my-[2]">
        <HiddenContainerAnimated title="Recommended" height={imageHeight + 30}>
          <MDMovieRecommendations movieId={movieId} />
        </HiddenContainerAnimated>
      </View>
      {/* VIDEOS */}
      <View className="flex-1 my-[2]">
        <HiddenContainerAnimated title="Videos" height={145}>
          <MDMovieVideos movieId={movieId} />
        </HiddenContainerAnimated>
      </View>
      {/* CAST */}
      <View className="flex-1 my-[2]">
        <HiddenContainerAnimated title="Cast" startOpen={true}>
          <MDMovieCast movieId={movieId} />
        </HiddenContainerAnimated>
      </View>
    </>
  );
};

export default MovieDetailsHiddenContainers;
