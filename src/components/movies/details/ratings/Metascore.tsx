import { View, Text } from "react-native";
import React from "react";

type Props = {
  metascore: string | undefined;
};
const Metascore = ({ metascore }: Props) => {
  if (!metascore) return null;

  const notGoodColor = "#AC831Faa";
  const goodColor = "#579C31aa";
  const isGood = parseInt(metascore) > 60;
  return (
    <View
      className="p-1 items-center border-hairline rounded-md"
      style={{ backgroundColor: isGood ? goodColor : notGoodColor }}
    >
      <Text>{metascore}</Text>
    </View>
  );
};

export default Metascore;
