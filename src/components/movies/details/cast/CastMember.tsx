import { View, Dimensions, Image, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { CastType, getPersonDetails, movieCredits_typedef } from "@markmccoid/tmdb_api";
import * as Linking from "expo-linking";
import { getProfileImage, getProfileImageIndex } from "@/utils/utils";

const { width, height } = Dimensions.get("window");
// Images 300 x 450
// width *1.5 to get height
// Pull code from LAAB to use hash to pull same one same name each time
const sideMargin = 10; // Margin on each side of the screen
const gapBetweenImages = 10; // Gap between each image
const borderWidth = 2; // Both sides, so 1 borderwidth should be 2 here
const numberOfImages = 3; // Number of images to tile across

// Calculate total margins and gaps
const totalSideMargins = sideMargin * 2 + borderWidth * numberOfImages;
const totalGaps = gapBetweenImages * (numberOfImages - 1);

// Calculate available width for images
const availableWidthForImages = width - totalSideMargins - totalGaps - borderWidth;

// Calculate width of each image
const imageWidth = availableWidthForImages / numberOfImages;
const imageHeight = imageWidth * 1.5;

const getPersonIMDBId = async (personId: number) => {
  try {
    const { data } = await getPersonDetails(personId);
    return data.imdbId;
  } catch (e) {
    console.log("ERROR Getting Person Details", e);
  }
};

type Props = {
  castInfo: movieCredits_typedef["data"]["cast"][number];
};
const CastMember = ({ castInfo }: Props) => {
  // const castPicURL =  getProfileImage(castInfo.name)
  const isDefaultImage = !castInfo?.profileURL;
  const castPicURL = castInfo?.profileURL
    ? { uri: castInfo.profileURL }
    : getProfileImage(castInfo.name);

  return (
    <View className="px-[5] my-[4]">
      <Pressable
        onPress={async () => {
          const imdbPersonId = await getPersonIMDBId(castInfo?.personId);
          console.log(imdbPersonId);
          Linking.openURL(`imdb:///name/${imdbPersonId}`).catch((err) => {
            Linking.openURL(`https://www.imdb.com/name/${imdbPersonId}/`);
            // Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
          });
        }}
      >
        <View
          className="bg-white"
          style={{
            borderRadius: 30,
            borderColor: "red",
            borderWidth: isDefaultImage ? 1 : 0,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          }}
        >
          <Image
            source={castPicURL}
            style={{
              width: imageWidth,
              height: imageHeight,
              resizeMode: "cover",
              borderRadius: 30,
            }}
          />
        </View>
      </Pressable>
      {/* Actor Name and Character Name */}

      <View
        className="flex-col justify-center items-center py-1 mt-1 mb-2"
        style={{
          borderRadius: 10,
          backgroundColor: "#ffffff55",
          width: imageWidth,
        }}
      >
        <Text className="text-base font-semibold">{castInfo?.name}</Text>
        <Text className="text-sm">{castInfo?.characterName}</Text>
      </View>
    </View>
  );
};

export default CastMember;
