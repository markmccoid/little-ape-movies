import { View, Text, ViewProps, ViewStyle } from "react-native";
import React from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";

const NestedStackDrawerToggle = ({
  className,
  style,
}: {
  className?: string;
  style?: ViewStyle;
}) => {
  const { colors } = useTheme();
  return (
    <View className={`ml-[-16] ${className}`} style={{ ...style }}>
      <DrawerToggleButton tintColor={colors.primary} />
    </View>
  );
};

export default NestedStackDrawerToggle;
