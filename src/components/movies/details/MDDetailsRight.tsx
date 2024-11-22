import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { addDelimitersToArray } from "@/utils/utils";

type Props = {
  genres: string[];
};
const MDDetailsRight = ({ genres }: Props) => {
  return (
    <View className="flex-1 ml-4 flex-col">
      <Text style={styles.textLabel}>Genres:</Text>
      <View className="flex-row gap-2">
        <Text numberOfLines={2} style={styles.textDesc}>
          {addDelimitersToArray(genres, ", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textLabel: {
    fontWeight: "600",
    paddingRight: 4,
    fontSize: 15,
  },
  textDesc: {
    fontSize: 15,
  },
});

export default MDDetailsRight;
