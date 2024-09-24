import { View, Text } from "react-native";
import React from "react";
import { SearchForPerson_Results } from "@markmccoid/tmdb_api";
import MovieImage from "@/components/common/MovieImage";

type Props = {
  person: SearchForPerson_Results;
};
const PersonSearchItem = ({ person }: Props) => {
  return (
    <View>
      <MovieImage posterURL={person.profileImageURL} title={person.name} imageWidth={120} />
    </View>
  );
};

export default PersonSearchItem;
