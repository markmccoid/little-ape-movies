import { View, Text } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { useCustomTheme } from "@/lib/colorThemes";
import { Sparkle } from "@/lib/icons/Sparkle";
import { Sparkles } from "@/lib/icons/Sparkles";

export const MotiFavorited = ({ size = 22 }) => {
  const { colors } = useCustomTheme();
  return (
    <MotiView
      key="fav"
      from={{ opacity: 0, scale: 0.6, padding: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        padding: 3,
        backgroundColor: colors.secondary,
      }}
      exit={{ opacity: 0.5, scale: 0.6 }}
      transition={{ type: "timing", duration: 200 }}
      className="rounded-full  border-hairline border-black"
      style={{ padding: 3 }}
    >
      <Sparkles fill="yellow" strokeWidth={1} className="color-black " size={size} />
    </MotiView>
  );
};

export const MotiNotFavorited = ({ size = 22 }) => {
  const { colors } = useCustomTheme();

  return (
    <MotiView
      key="notfav"
      from={{ opacity: 0, scale: 0.6, padding: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        padding: 3,
        backgroundColor: "lightgray",
      }}
      exit={{ opacity: 0.5, scale: 0.6 }}
      transition={{ type: "timing", duration: 200 }}
      className="rounded-full  border-hairline border-black"
      style={{ padding: 3 }}
    >
      <Sparkle fill="white" strokeWidth={1} className="color-black " size={size} />
    </MotiView>
  );
};
