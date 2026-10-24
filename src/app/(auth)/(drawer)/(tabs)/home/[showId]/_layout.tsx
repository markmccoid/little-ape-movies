import { Text, Pressable } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";

import { ChevronLeft } from "@/lib/icons/ChevronLeft";
import { useCustomTheme } from "@/lib/colorThemes";

const ShowIdLayout = () => {
  const router = useRouter();
  const { colors } = useCustomTheme();
  return (
    <Stack
      screenOptions={{
        // iOS 26+ defaults to a transparent Liquid Glass header and lays the
        // screen underneath it. Keep the bar opaque so details start below it.
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
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
