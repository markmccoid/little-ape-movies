import React from "react";
import { Stack } from "expo-router";
import { getCurrentUser } from "@/store/dataAccess/localStorage-users";

const AuthLayout = () => {
  React.useEffect(() => {
    console.log("Auth Login", getCurrentUser());
    return () => console.log("Auth LOGOUT", getCurrentUser());
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false, title: "Movies" }} />
      {/* <Stack.Screen name="detail" options={{}} /> */}
    </Stack>
  );
};

export default AuthLayout;
