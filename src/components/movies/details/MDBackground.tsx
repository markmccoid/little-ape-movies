import { View } from "react-native";
import React from "react";

const MDBackground = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        opacity: 0.5,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
      }}
    />
  );
};

export default MDBackground;
