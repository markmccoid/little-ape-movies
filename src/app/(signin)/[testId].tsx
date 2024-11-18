import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";

const TestRoute = () => {
  const { testId, parm2, parm3 } = useGlobalSearchParams();
  const router = useRouter();
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };
  return (
    <View>
      <Text>
        TestRoute - {testId} = {parm3} - {parm2}
      </Text>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/[testId]",
            params: { testId: `next-${generateRandomNumber()}` },
          })
        }
      >
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestRoute;
