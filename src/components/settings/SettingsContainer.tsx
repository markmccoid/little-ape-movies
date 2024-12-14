import { View, Text, Pressable, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { useMovieActions } from "@/store/store.shows";
import { useAuth } from "@/providers/AuthProvider";
import { SymbolView } from "expo-symbols";
import { useCustomTheme } from "@/lib/colorThemes";

const SettingsContainer = () => {
  const actions = useMovieActions();
  const { currentUser: user, onLogout } = useAuth();
  const router = useRouter();
  const { colors } = useCustomTheme();
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="">
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(auth)/(drawer)/settings/savedfiltersroute" })}
          className="bg-card py-4 px-6 border-b-hairline border-border flex-row justify-between items-center"
        >
          <Text className="text-lg text-card-foreground">Saved Filters</Text>
          <SymbolView name="chevron.right" size={18} weight="semibold" tintColor={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(auth)/(drawer)/settings/quicksortroute" })}
          className="bg-card py-4 px-6 border-b-hairline border-border flex-row justify-between items-center"
        >
          <Text className="text-lg text-card-foreground">Quick Sort</Text>
          <SymbolView name="chevron.right" size={18} weight="semibold" tintColor={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsContainer;

{
  /* <Link href="/(auth)/(drawer)/settings/settingone">
        <Text>Setting Page 1</Text>
      </Link>
      <Pressable onPress={actions.clearStore}>
        <Text>Clear ALL movies</Text>
      </Pressable>
      <Pressable onPress={() => onLogout()}>
        <Text>Log Out</Text>
      </Pressable> */
}
