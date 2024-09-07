import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";

const MovieDetails = ({ movieId, newMovie }: { movieId: string; newMovie: number }) => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 mt-[150]">
      <Text>MovieDetail - {movieId}</Text>
      <Link href={`./${newMovie}`} push className="border-hairline">
        <Text>GoTo {newMovie}</Text>
      </Link>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>GO BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
