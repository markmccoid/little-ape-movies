import { View, Text, ImageStyle, ImageProps } from "react-native";
import { Image, ImageContentFit } from "expo-image";
import React from "react";

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

  const blurhash = "UAByv*^%4:E2~Vo}0LM{IUt7E2RjxtNGs-xt";
  //"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  if (!posterURL) {
    return (
      <View className="flex-row">
        <Image
          className={`border rounded-lg rounded-b-none`}
          source={require("../../../assets/images/DefaultImage.png")}
          style={{ width: imageWidth, height: imageHeight, opacity: 0.7, ...imageStyle }}
          contentFit={resizeMode}
          placeholder={{ blurhash }}
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
      source={posterURL}
      // source={{ uri: posterURL }}
      contentFit="contain"
      placeholder={{ blurhash }}
      style={{
        width: imageWidth,
        height: imageHeight,
        // resizeMode,
        overflow: "hidden",
        ...imageStyle,
      }}
    />
  );
};

export default MovieImage;
