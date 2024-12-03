import { View, Text } from "react-native";
import React from "react";
import { useCustomTheme } from "@/lib/colorThemes";
import { EyeOff } from "@/lib/icons/EyeOff";
import { Eye } from "@/lib/icons/Eye";

export const Watched = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <View
      key="watched"
      className="rounded-full border-hairline border-black z-10 bg-secondary p-[3]"
    >
      <Eye fill={colors.includeGreen} strokeWidth={1} className="color-black " size={size} />
    </View>
  );
};

export const NotWatched = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <View
      key="notwatch"
      className="rounded-full border-hairline border-black z-10 bg-secondary p-[3]"
    >
      <EyeOff fill={"white"} strokeWidth={1} className="color-black " size={size} />
    </View>
  );
};
