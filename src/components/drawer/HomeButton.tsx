import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { HomeIcon } from "../common/Icons";

const HomeButton = () => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push("/home");
      }}
      className="px-2"
    >
      <HomeIcon />
    </Pressable>
  );
};

export default HomeButton;
