import React from "react";
import { View, StyleSheet, SafeAreaView, Pressable, ScrollView } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/providers/AuthProvider";
import { SymbolView } from "expo-symbols";
import { Link, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomTheme } from "@/lib/colorThemes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckSquareIcon, FilterIcon } from "../common/Icons";
import { Text } from "@/components/ui/text";
import Constants from "expo-constants";
import useSettingsStore, { useSettingsActions } from "@/store/store.settings";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const savedQuickSorts = useSettingsStore.getState().savedQuickSorts;
  const settingsActions = useSettingsActions();
  const { currentUser, onLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version;

  const { colors } = useCustomTheme();
  const router = useRouter();

  const navigation = props.navigation;
  return (
    <View className="flex-1 bg-secondary">
      {/* HEADER */}
      <View className="flex-col p-[20] border-b border-border ">
        <View className="flex-row items-center gap-4 " style={{ marginTop: insets.top }}>
          <SymbolView
            name="person.fill"
            type="palette"
            colors={[colors.secondaryForeground, colors.secondaryForeground]}
          />
          <Text className="text-3xl font-bold">{currentUser}</Text>
        </View>
        <Text>release {appVersion}</Text>
      </View>
      {/* HOME and SETTINGS Links */}
      <View className="bg-card">
        {/* <Pressable
          onPress={async () => {
            router.replace("./home");
            await new Promise((resolve) => setTimeout(() => resolve("done"), 100));
            navigation.closeDrawer();
          }}
          className={`px-[10] py-[5] bg-card  w-full`}
        > */}
        <Link href="/home" className={`m-2  mx-2`}>
          <View
            className="px-[10] py-[5] bg-card flex-row items-center gap-3 w-full rounded-lg"
            style={{ margin: 10 }}
          >
            <SymbolView
              name="house"
              size={20}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className="text-lg ">Home</Text>
            {/* {pathname === "/home" && <CheckSquareIcon />} */}
          </View>
        </Link>
        {/* </Pressable> */}

        {/* Divider Line */}
        <View className="w-full border-b-hairline border-border" />

        <Link href="/settings" className="m-2  mx-2">
          <View className={`px-[10] py-[5] bg-card flex-row items-center gap-3 w-full rounded-lg`}>
            <SymbolView
              name="gear"
              size={20}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className="text-lg ">Settings</Text>
          </View>
        </Link>
      </View>
      {/* Saved Queries ??? */}
      <View
        className={`p-[10] pl-[20] bg-card flex-row items-center gap-3 w-full border-border border-t-hairline`}
      >
        <FilterIcon size={18} color={colors.primary} />
        <Text className="text-lg ">Saved Filters</Text>
      </View>
      <View className="flex-1">
        <ScrollView
          // {...props}
          className="border-t-hairline border-border mt-0 flex-1"
          contentContainerStyle={{
            paddingTop: 0,
            marginLeft: 20,
            // paddingHorizontal: 0,
            // marginHorizontal: 0,
            // backgroundColor: "gray",
            // borderWidth: 1,
          }}
        >
          <View className={`bg-primary border-border border-hairline py-1 px-2 rounded-l-lg my-1`}>
            <Text className="text-lg font-semibold color-primary-foreground">Saved Filters</Text>
          </View>
          <View className={`bg-primary border-border border-hairline py-1 px-2 rounded-l-lg my-1`}>
            <Text className="text-lg font-semibold color-primary-foreground">Saved Filters</Text>
          </View>
          <View className={`bg-primary border-border border-hairline py-1 px-2 rounded-l-lg my-1`}>
            <Text className="text-lg font-semibold color-primary-foreground">Saved Filters</Text>
          </View>
        </ScrollView>
      </View>
      <View className={` pl-[20] bg-card flex-row items-center gap-3 w-full `}>
        <Pressable
          className="p-[10] ml-[-10]"
          onPress={async () => {
            router.push({ pathname: "/(auth)/(drawer)/settings" });
            // Need the setTimeout so that the first push finishes before this route
            setTimeout(
              () => router.push({ pathname: "/(auth)/(drawer)/settings/quicksortroute" }),
              0
            );
          }}
        >
          <SymbolView
            name="slider.horizontal.3"
            size={20}
            weight="bold"
            type="palette"
            colors={[colors.text, colors.text]}
          />
        </Pressable>
        <Text className="text-lg ">Quick Sort</Text>
      </View>
      <ScrollView
        className="border-t-hairline border-border mt-0 flex-1"
        contentContainerStyle={{
          paddingTop: 0,
          marginLeft: 20,
        }}
      >
        {savedQuickSorts?.map((sort) => {
          return (
            <View
              key={sort.id}
              className={`bg-primary border-border border-hairline py-1 px-2 rounded-l-lg my-1`}
            >
              <Pressable
                onPress={async () => {
                  settingsActions.updateSortSettings(sort.sort);
                  router.replace("./home");
                  await new Promise((resolve) => setTimeout(() => resolve("done"), 100));
                  navigation.closeDrawer();
                }}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  className="text-primary-foreground text-lg font-semibold"
                >
                  {sort.name}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <View style={{ height: insets.bottom + 50 }} className="border-t border-border">
        <TouchableOpacity onPress={onLogout}>
          <View className="h-[50] px-[20] py-[10] flex-row gap-4 items-center">
            <SymbolView
              name="rectangle.portrait.and.arrow.right.fill"
              size={28}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className=" text-lg font-semibold">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawerContent;
