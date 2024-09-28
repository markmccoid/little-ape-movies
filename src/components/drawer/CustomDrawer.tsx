import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useAuth } from "@/providers/AuthProvider";
import { SymbolView } from "expo-symbols";
import { Link, useNavigation, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomTheme } from "@/utils/colorThemes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckSquareIcon, FilterIcon } from "../common/Icons";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { currentUser, onLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { colors } = useCustomTheme();

  return (
    <View className="flex-1 bg-secondary">
      {/* HEADER */}
      <View
        className="p-[20] flex-row items-center gap-4 border-b border-border"
        style={{ marginTop: insets.top }}
      >
        <SymbolView name="person.fill" type="palette" colors={[colors.primary, colors.primary]} />
        <Text className="text-3xl text-text font-bold">{currentUser}</Text>
      </View>
      {/* HOME and SETTINGS Links */}
      <View className="bg-card">
        <Link href="/home" className="mt-2 mx-2">
          <View
            className={`px-[10] py-[5] bg-card flex-row items-center gap-3 rounded-lg w-full`}
            style={{ margin: 10 }}
          >
            <SymbolView
              name="house"
              size={20}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className="text-lg text-text">Home</Text>
            {/* {pathname === "/home" && <CheckSquareIcon />} */}
          </View>
        </Link>
        {/* Divider Line */}
        <View className="w-full border-b-hairline" />

        <Link href="/settings" className="m-2  mx-2">
          <View className={`px-[10] py-[5] bg-card flex-row items-center gap-3 w-full rounded-lg`}>
            <SymbolView
              name="gear"
              size={20}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className="text-lg text-text">Settings</Text>
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
          <Text className="text-lg text-text">Saved Filters</Text>
        </View>
      </DrawerContentScrollView>
      <View style={{ height: insets.bottom + 50 }}>
        <TouchableOpacity onPress={onLogout}>
          <View className="h-[50] px-[20] py-[10] flex-row gap-4 items-center">
            <SymbolView
              name="rectangle.portrait.and.arrow.right.fill"
              size={28}
              weight="bold"
              type="palette"
              colors={[colors.text, colors.text]}
            />
            <Text className="text-text text-lg font-semibold">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawerContent;
