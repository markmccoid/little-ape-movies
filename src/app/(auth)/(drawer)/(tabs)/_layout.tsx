import React from "react";
import { Tabs } from "expo-router";
import { AddIcon, MovieIcon, TagIcon } from "@/components/common/Icons";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "home",
};
const Layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ color }) => <MovieIcon size={25} color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <AddIcon size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          tabBarIcon: ({ color }) => <TagIcon size={25} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
