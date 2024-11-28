import { View, Text } from "react-native";
import React from "react";
import ImageModalContainer from "@/components/movies/details/detailmodal/ImageModalContainer";
import { useGlobalSearchParams } from "expo-router";

const DetailImagemodal = () => {
  const { showId } = useGlobalSearchParams();

  return <ImageModalContainer movieId={parseInt(showId as string, 10)} />;
};

export default DetailImagemodal;
