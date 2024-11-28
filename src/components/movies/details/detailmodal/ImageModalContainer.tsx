import {
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useMovieImages } from "@/store/dataHooks";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useMovieActions } from "@/store/store.shows";
import MovieImage from "@/components/common/MovieImage";

type Props = {
  movieId: number;
};
const { width, height } = Dimensions.get("window");
const MARGIN = 10;
const ImageWidth = (width - (MARGIN + 1) * 3) / 2;

const ImageModalContainer = ({ movieId }: Props) => {
  const router = useRouter();
  const { data: movieImages, isLoading } = useMovieImages(movieId);
  const updateShow = useMovieActions().updateShow;
  const [largeImageURL, setLargeImageURL] = useState<string | undefined>(undefined);

  const handleImagePress = (imageURL: string) => {
    setLargeImageURL(imageURL);
  };
  const handleUpdateImage = () => {
    updateShow(movieId, { posterURL: largeImageURL });
    router.dismiss();
  };
  if (isLoading || !movieImages) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Animated.View entering={FadeIn.duration(1000)} exiting={FadeOut}>
      {largeImageURL ? (
        <Animated.View className={`mx-[${MARGIN}] mt-2`} entering={FadeIn} exiting={FadeOut}>
          <View className="flex-row gap-3 justify-end mr-2 mb-2 mt-2">
            <Button onPress={handleUpdateImage}>
              <Text>Select</Text>
            </Button>
            <Button onPress={() => setLargeImageURL(undefined)}>
              <Text>Cancel</Text>
            </Button>
          </View>
          <MovieImage
            posterURL={largeImageURL}
            imageWidth={width - MARGIN * 2}
            resizeMode="contain"
            title=""
            imageStyle={{
              borderRadius: 10,
              borderWidth: StyleSheet.hairlineWidth,
            }}
          />
        </Animated.View>
      ) : (
        <Animated.ScrollView
          className={`mx-[${MARGIN}]`}
          contentContainerClassName={`flex-row flex-wrap gap-[${MARGIN}]`}
          style={{ paddingTop: 10 }}
          entering={FadeIn}
        >
          {movieImages.map((image, index) => {
            return (
              <TouchableOpacity onPress={() => handleImagePress(image)} key={index}>
                <MovieImage
                  posterURL={image}
                  imageWidth={ImageWidth}
                  resizeMode="contain"
                  title=""
                  imageStyle={{
                    borderRadius: 10,
                    borderWidth: StyleSheet.hairlineWidth,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      )}
    </Animated.View>
  );
};

export default ImageModalContainer;
