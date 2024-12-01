import { View, Text } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { useCustomTheme } from "@/lib/colorThemes";
import { EyeOff } from "@/lib/icons/EyeOff";
import { Eye } from "@/lib/icons/Eye";

export const MotiWatched = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <MotiView
      key="watched"
      from={{ opacity: 0, scale: 0.6, padding: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        padding: 3,
        backgroundColor: colors.secondary,
      }}
      exit={{ opacity: 0.5, scale: 0.6 }}
      transition={{ type: "timing", duration: 200 }}
      className="rounded-full border-hairline border-black z-10"
    >
      <Eye fill={colors.includeGreen} strokeWidth={1} className="color-black " size={size} />
    </MotiView>
  );
};

export const MotiNotWatched = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <MotiView
      key="notwatch"
      from={{ opacity: 0, scale: 0.6, padding: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        padding: 3,
        backgroundColor: "lightgray",
      }}
      exit={{ opacity: 0.5, scale: 0.6 }}
      transition={{ type: "timing", duration: 200 }}
      className="rounded-full border-hairline border-black z-10"
    >
      <EyeOff fill={"white"} strokeWidth={1} className="color-black " size={size} />
    </MotiView>
  );
};
