import { View, Text, ViewProps, ViewStyle } from "react-native";
import React from "react";
import { DrawerToggleButton } from "expo-router/drawer";
import { useTheme } from "expo-router";

const NestedStackDrawerToggle = ({
  className,
  style,
}: {
  className?: string;
  style?: ViewStyle;
}) => {
  const { colors } = useTheme();
  return (
    <View className={`items-center justify-center ${className ?? ""}`} style={style}>
      <DrawerToggleButton tintColor={colors.primary} />
    </View>
  );
};

export default NestedStackDrawerToggle;
