import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { getPersonDetails, SearchForPerson_Results } from "@markmccoid/tmdb_api";
import MovieImage from "@/components/common/MovieImage";
import { Link, useNavigation, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { IMDBIcon, MovieIcon } from "@/components/common/Icons";

type Props = {
  person: SearchForPerson_Results;
  imageWidth: number;
};
const PersonSearchItem = ({ person, imageWidth }: Props) => {
  const navigation = useNavigation();
  const router = useRouter();
  const openImdb = async () => {
    const details = await getPersonDetails(person.id);
    const imdbId = details.data.imdbId;
    Linking.openURL(`imdb:///name/${imdbId}`).catch((err) => {
      // console.log("Caught", imdbId);
      // Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
      Linking.openURL(`https://imdb.com/name/${imdbId}`);
    });
  };
  return (
    <Pressable
      className="mb-4"
      onPress={() => {
        router.push({
          pathname: `/(auth)/(drawer)/(tabs)/search/personmovies/${person.id}`,
          params: { personName: person.name },
        });
      }}
    >
      <Pressable className="absolute z-10 top-[-10] right-[-4]" onPress={openImdb}>
        <View className="bg-black w-[39] h-[38] absolute mt-1" />
        <IMDBIcon
          color="#ECC233"
          size={45}
          // style={{ zIndex: 10, position: "absolute", backgroundColor: "black" }}
        />
      </Pressable>
      <View key={person.id} className="border-hairline rounded-lg overflow-hidden">
        <MovieImage
          posterURL={person.profileImageURL}
          title={person.name}
          imageWidth={imageWidth}
        />
        <TouchableOpacity onPress={openImdb}>
          <View className="mt-[-5] bg-primary" style={{ width: imageWidth }}>
            <Text
              className="px-[5] text-text-inverted font-semibold text-center py-[4]"
              numberOfLines={1}
              lineBreakMode="clip"
            >
              {person.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
  return (
    <View>
      {/* <MovieImage posterURL={person.profileImageURL} title={person.name} imageWidth={120} /> */}
    </View>
  );
};

export default PersonSearchItem;
