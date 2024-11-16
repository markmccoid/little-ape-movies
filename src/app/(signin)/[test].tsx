import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";

const TestRoute = () => {
  const { test, parm2, parm3 } = useGlobalSearchParams();
  const router = useRouter();
  return (
    <View>
      <Text>
        TestRoute - {test} = {parm3} - {parm2}
      </Text>

      <TouchableOpacity
        onPress={() =>
          router.replace({
            pathname: "/[test]?parm3=x&parm2=whup",
            params: { test: "next" },
          })
        }
      >
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestRoute;
