import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import useSettingsStore from "@/store/store.settings";
import { SymbolView } from "expo-symbols";
import { useCustomTheme } from "@/lib/colorThemes";
import { MotiView } from "moti";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  isVisible: boolean;
  handleSetVisible: (value: boolean) => void;
  searchY: SharedValue<number>;
};
const MovieSearch = ({ isVisible, handleSetVisible, searchY }: Props) => {
  const titleSearchValue = useSettingsStore((state) => state.titleSearchValue);
  const titleSearchScope = useSettingsStore((state) => state.titleSearchScope);
  const setTitleSearchValue = useSettingsStore((state) => state.actions.setTitleSearchValue);
  const setTitleSearchScope = useSettingsStore((state) => state.actions.setTitleSearchScope);
  const { colors } = useCustomTheme();
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => setTitleSearchValue(""), 300);
    } else {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: searchY.value === -40 ? withTiming(0, { duration: 300 }) : 1,
    };
  });
  return (
    <Animated.View
      className="flex-row items-center absolute w-full"
      // style={{ opacity: isVistssible ? 1 : 0 }}
      style={[animStyle]}
    >
      <Pressable
        onPress={() => handleSetVisible(false)}
        className="ml-2 mr-1 bg-primary-foreground rounded-lg"
      >
        <SymbolView name="arrowtriangle.up.square" tintColor={colors.primary} size={25} />
      </Pressable>
      <TextInput
        ref={inputRef}
        placeholder={titleSearchScope === "all" ? "Search all movies" : "Search filtered movies"}
        value={titleSearchValue}
        editable={isVisible}
        onChangeText={(text) => setTitleSearchValue(text)}
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "gray",
          backgroundColor: colors.card,
          padding: 10,
          marginRight: 10,
          // marginTop: 5,
          borderRadius: 10,
          color: colors.cardForeground,
          flexGrow: 1,
        }}
        autoCorrect={false}
      />

      {titleSearchValue !== "" && (
        <Pressable className="absolute right-[100]" onPress={() => setTitleSearchValue("")}>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: titleSearchValue ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <SymbolView name="x.circle.fill" type="palette" colors={["white", "gray"]} size={17} />
          </MotiView>
        </Pressable>
      )}

      <View className="flex-row p-[10] relative">
        <Pressable onPress={() => setTitleSearchScope("all")} className="rounded-full mr-[10]">
          <MotiView
            animate={{
              backgroundColor:
                titleSearchScope === "all" ? colors.primary : colors.primaryForeground,
              opacity: titleSearchScope === "all" ? 1 : 0.4,
            }}
            transition={{
              type: "timing",
              duration: 500, // Adjust duration as needed
            }}
            className="rounded-full"
          >
            <SymbolView
              size={25}
              name="magnifyingglass.circle"
              tintColor={
                titleSearchScope === "all" ? colors.primaryForeground : colors.secondaryForeground
              }
            />
          </MotiView>
        </Pressable>
        <Pressable onPress={() => setTitleSearchScope("filteronly")} className=" rounded-full">
          <MotiView
            animate={{
              backgroundColor:
                titleSearchScope === "filteronly" ? colors.primary : colors.primaryForeground,
              opacity: titleSearchScope === "filteronly" ? 1 : 0.4,
            }}
            transition={{
              type: "timing",
              duration: 500, // Adjust duration as needed
            }}
            className="rounded-full"
          >
            <SymbolView
              size={25}
              name="line.3.horizontal.decrease.circle"
              tintColor={
                titleSearchScope === "filteronly"
                  ? colors.primaryForeground
                  : colors.secondaryForeground
              }
            />
          </MotiView>
        </Pressable>
        <MotiView
          from={{ translateX: titleSearchScope === "all" ? 45 : 10 }}
          animate={{ translateX: titleSearchScope === "all" ? 10 : 45 }}
          transition={{ type: "timing", duration: 500 }}
          className="absolute w-[25] h-1 bg-primary bottom-[5] left-0"
        />
      </View>
    </Animated.View>
  );
};

export default MovieSearch;
