import { View, Text } from "react-native";
import React from "react";
import { useCustomTheme } from "@/lib/colorThemes";
import { Sparkle } from "@/lib/icons/Sparkle";
import { Sparkles } from "@/lib/icons/Sparkles";

export const Favorited = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <View
      key="fav"
      className="rounded-full  border-hairline border-black bg-secondary z-10"
      style={{ padding: 3 }}
    >
      <Sparkles fill="yellow" strokeWidth={1} className="color-black " size={size} />
    </View>
  );
};

export const NotFavorited = ({ size = 22 }) => {
  const { colors } = useCustomTheme();

  return (
    <View
      key="notfav"
      className="rounded-full  border-hairline border-black bg-secondary"
      style={{ padding: 3 }}
    >
      <Sparkle fill="white" strokeWidth={1} className="color-black " size={size} />
    </View>
  );
};
