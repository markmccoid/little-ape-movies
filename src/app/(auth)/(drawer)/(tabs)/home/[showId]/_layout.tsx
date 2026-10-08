import { View, Text, Pressable } from "react-native";
import React from "react";
import { Stack, useNavigation, useRouter, useSegments } from "expo-router";

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
        getId={({ params }) => {
          const showId = params?.showId;
          if (typeof showId === "string" || typeof showId === "number") {
            return String(showId);
          }
          return undefined;
        }}
      />
      <Stack.Screen
        name="detailimagemodal"
        options={{ presentation: "modal", title: "Change Image" }}
      />
    </Stack>
  );
};

export default ShowIdLayout;
