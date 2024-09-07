import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import SignIn from "@/components/signin/SignIn";

const SignInRoute = () => {
  return (
    <View className="flex-1">
      <SignIn />
    </View>
  );
};

export default SignInRoute;
