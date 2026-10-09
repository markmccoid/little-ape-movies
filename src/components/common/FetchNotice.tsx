import { Text, View } from "react-native";
import React from "react";

type Props = {
  message: string;
};

const FetchNotice: React.FC<Props> = ({ message }) => {
  return (
    <View className="items-center justify-center px-6 py-4">
      <Text className="text-center text-base">{message}</Text>
    </View>
  );
};

export default FetchNotice;
