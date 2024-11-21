import React from "react";
import { View, StyleSheet, SafeAreaView, Pressable } from "react-native";
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

function CustomDrawerContent(props: DrawerContentComponentProps) {
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
        <Pressable
          onPress={async () => {
            router.replace("./home");
            await new Promise((resolve) => setTimeout(() => resolve("done"), 100));
            navigation.closeDrawer();
          }}
          className={`px-[10] py-[5] bg-card  w-full`}
        >
          <View className="flex-row items-center gap-3 rounded-lg" style={{ margin: 10 }}>
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
        </Pressable>

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
      <DrawerContentScrollView
        {...props}
        className="bg-card border-t-hairline border-border"
        contentContainerStyle={{ paddingTop: 0, marginTop: 5 }}
      >
        <View className={`p-[10] pl-[20] bg-card flex-row items-center gap-3 w-full rounded-lg`}>
          <FilterIcon size={18} color={colors.text} />
          <Text className="text-lg ">Saved Filters</Text>
        </View>
      </DrawerContentScrollView>
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
