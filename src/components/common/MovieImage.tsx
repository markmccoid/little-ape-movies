import { View, Text, ImageStyle, ImageProps, Image } from "react-native";
import { Image as ExpoImage, ImageContentFit } from "expo-image";
import React from "react";
import { getDefaultPosterImage } from "@/utils/utils";

type Props = {
  posterURL: string | undefined;
  title: string;
  imageWidth: number;
  imageHeight?: number;
  resizeMode?: ImageContentFit;
  imageStyle?: ImageStyle;
};

const MovieImage = ({
  imageStyle,
  posterURL,
  title,
  imageWidth,
  imageHeight,
  resizeMode = "contain",
}: Props) => {
  if (!imageHeight) {
    imageHeight = imageWidth * 1.5;
  }
  const isDefaultImage = !posterURL;
  const defaultPosterURL = !posterURL && getDefaultPosterImage(title);

  if (!posterURL) {
    return (
      <View className="flex-row">
        <Image
          className={`border rounded-lg rounded-b-none`}
          source={defaultPosterURL}
          style={{ width: imageWidth, height: imageHeight, opacity: 0.7, ...imageStyle }}
        />
        <Text
          className="absolute text-text text-center font-semibold text-white"
          style={{ width: imageWidth, top: 8, paddingHorizontal: 6 }}
          numberOfLines={2}
        >
          {title}{" "}
        </Text>
      </View>
    );
  }
  return (
    <Image
      className="border-hairline border-border"
      source={{ uri: posterURL }}
      style={{
        width: imageWidth,
        height: imageHeight,
        overflow: "hidden",
        ...imageStyle,
      }}
    />
  );
};

export default MovieImage;
