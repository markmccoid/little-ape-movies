import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { HomeIcon } from "../common/Icons";
import { useCustomTheme } from "@/lib/colorThemes";

const HomeButton = () => {
  const router = useRouter();
  const { colors } = useCustomTheme();
  return (
    <Pressable
      onPress={() => {
        router.push("/home");
      }}
      className="px-2"
    >
      <HomeIcon color={colors.primary} />
    </Pressable>
  );
};

export default HomeButton;
