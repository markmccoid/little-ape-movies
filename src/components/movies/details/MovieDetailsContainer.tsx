import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useLayoutEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import MovieImage from "@/components/common/MovieImage";
import { useMovieData } from "@/store/dataHooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const { width, height } = Dimensions.get("window");

const MovieDetailsContainer = ({ movieId }: { movieId: number }) => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const { data: movie, isLoading } = useMovieData(movieId);

  useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      headerRight: () => (
        <View>
          <Text>+</Text>
        </View>
      ),
    };
  }, []);
  useFocusEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: movie?.title || "",
    };
    navigation.setOptions(options);
  });
  console.log(movie.posterColors);
  //
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: movie?.title || "",
  //   });
  // }, [isLoading]);
  if (isLoading || !movie)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );

  const backgroundStartColor = movie?.posterColors?.background?.color || "#000000";
  const backgroundEndColor = movie?.posterColors?.lightestColor || "#FFFFFF";

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[backgroundStartColor, backgroundEndColor]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5 }}
      />
      <View className="flex-1" style={{ marginTop: headerHeight }}>
        {/* <Text className="text-text text-lg font-semibold">{movie.title}</Text> */}
        <MovieImage posterURL={movie?.posterURL} imageWidth={150} title={movie?.title} />
        <Text className="text-text">MovieId {movie.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetailsContainer;
