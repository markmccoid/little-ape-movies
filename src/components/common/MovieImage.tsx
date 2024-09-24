import { View, Text, Image, ImageStyle, ImageProps } from "react-native";
import React from "react";

type Props = {
  posterURL: string;
  title: string;
  imageWidth: number;
  imageHeight?: number;
  resizeMode?: "cover" | "contain" | "center" | "repeat" | "stretch";
  imageStyle?: ImageStyle;
};

const MovieImage = ({
  imageStyle,
  posterURL,
  title,
  imageWidth,
  imageHeight,
  resizeMode = "cover",
}: Props) => {
  if (!imageHeight) {
    imageHeight = imageWidth * 1.5;
  }

  if (!posterURL) {
    return (
      <View className="flex-row">
        <Image
          className={`border rounded-lg rounded-b-none opacity-35`}
          source={require("../../../assets/images/DefaultImage.png")}
          style={{ width: imageWidth, height: imageHeight, resizeMode, ...imageStyle }}
        />
        <Text
          className="absolute text-text text-center font-semibold text-base bottom-5"
          style={{ width: imageWidth }}
          numberOfLines={2}
        >
          {title}{" "}
        </Text>
      </View>
    );
  }
  return (
    <Image
      className="border-hairline border-border rounded-lg"
      source={{ uri: posterURL }}
      style={{ width: imageWidth, height: imageHeight, resizeMode, ...imageStyle }}
    />
  );
};

export default MovieImage;
