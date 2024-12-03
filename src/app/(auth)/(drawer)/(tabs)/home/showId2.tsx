import { View, Text } from "react-native";
import React from "react";
import useIsReady from "@/hooks/useIsReady";

const index = () => {
  const ready = useIsReady();
  console.log("READY ", ready);
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;
