import { View, Text, Pressable } from "react-native";
import React from "react";
import { Stack, useNavigation, useRouter, useSegments } from "expo-router";
// import { useNavigation } from "@react-navigation/native";

import { ChevronLeft } from "@/lib/icons/ChevronLeft";

const ShowIdLayout = () => {
  const router = useRouter();
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          headerLeft: () => (
            <Pressable onPress={router.back} className="flex-row ml-[-10] items-center">
              <ChevronLeft size={30} />

              <Text className="text-xl text-primary ">Back</Text>
            </Pressable>
          ),
        }}
        getId={({ params }) => params.showId}
      />
      <Stack.Screen
        name="detailimagemodal"
        options={{ presentation: "modal", title: "Change Image" }}
      />
    </Stack>
  );
};

export default ShowIdLayout;
