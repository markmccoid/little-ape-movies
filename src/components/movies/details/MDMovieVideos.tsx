import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useMovieVideos } from "@/store/dataHooks";
import * as Linking from "expo-linking";
import { YouTubePlayIcon } from "@/components/common/Icons";
import MovieImage from "@/components/common/MovieImage";

const THUMBNAIL_WIDTH = 120 * 1.77;
const THUMBNAIL_HEIGHT = 120;

type Props = {
  movieId: number | undefined;
};
const MDMovieVideos = ({ movieId }: Props) => {
  if (!movieId) return null;
  const { data: videoData, isLoading } = useMovieVideos(movieId);

  return (
    <View style={{ flexDirection: "row" }}>
      <ScrollView horizontal>
        {videoData &&
          videoData.map((video) => {
            return (
              <TouchableOpacity
                key={video.id}
                style={{
                  marginHorizontal: 10,
                }}
                onPress={() => Linking.openURL(video.videoURL)}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{video.type}</Text>
                <View
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    top: THUMBNAIL_HEIGHT / 2 - 15,
                    left: THUMBNAIL_WIDTH / 2 - 30,
                  }}
                >
                  <YouTubePlayIcon size={60} style={{ opacity: 0.7 }} />
                </View>
                <MovieImage
                  title="Video"
                  posterURL={video.videoThumbnailURL}
                  imageWidth={THUMBNAIL_WIDTH}
                  imageHeight={THUMBNAIL_HEIGHT}
                  imageStyle={{
                    borderRadius: 10,
                    opacity: 0.7,
                    borderColor: "#777",
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default MDMovieVideos;
