import { View, Pressable } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Sparkle } from "@/lib/icons/Sparkle";
import { Sparkles } from "@/lib/icons/Sparkles";
import { EyeOff } from "@/lib/icons/EyeOff";
import { Eye } from "@/lib/icons/Eye";
import MDBackground from "../MDBackground";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import { Text } from "@/components/ui/text";
import { useCustomTheme } from "@/lib/colorThemes";
import Animated, { withSpring } from "react-native-reanimated";
import DatePicker from "react-native-date-picker";

const iconSpring = { stiffness: 200, damping: 15 };

function selectedIconEntering() {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0 }],
    },
    animations: {
      opacity: withSpring(1, iconSpring),
      transform: [{ scale: withSpring(1.2, iconSpring) }],
    },
  };
}

function unselectedIconEntering() {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0 }],
    },
    animations: {
      opacity: withSpring(1, iconSpring),
      transform: [{ scale: withSpring(1, iconSpring) }],
    },
  };
}

function selectedIconExiting() {
  "worklet";
  return {
    initialValues: {
      opacity: 1,
      transform: [{ scale: 1.2 }],
    },
    animations: {
      opacity: withSpring(0, iconSpring),
      transform: [{ scale: withSpring(0, iconSpring) }],
    },
  };
}

function unselectedIconExiting() {
  "worklet";
  return {
    initialValues: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    animations: {
      opacity: withSpring(0, iconSpring),
      transform: [{ scale: withSpring(0, iconSpring) }],
    },
  };
}

type Props = {
  storedMovie: ShowItemType | undefined;
};
const MDFavWatched = ({ storedMovie }: Props) => {
  const actions = useMovieActions();
  const { colors } = useCustomTheme();
  const [localWatched, setLocalWatched] = useState(!!storedMovie?.watched);
  const [localFavorited, setLocalFavorited] = useState(!!storedMovie?.favorited);
  // Date picker open state used for watched date on long press
  const [open, setOpen] = useState(false);
  const pickerDate = useMemo(
    () => (storedMovie?.watched ? new Date(storedMovie?.watched * 1000) : new Date()),
    [storedMovie?.watched]
  );

  if (!storedMovie?.id) return;

  // Handle watched state with regular press.  Sets to today's date
  const handleWatched = () => {
    setLocalWatched((prev) => !prev);
    setTimeout(() => actions.toggleWatched(storedMovie.id, undefined, Date.now()), 200);
  };
  // Handle watched state with long press.  Sets to selected date
  const handleWatchedDate = (date: Date) => {
    setTimeout(() => actions.toggleWatched(storedMovie.id, "on", date.getTime()), 200);
    if (localWatched) return;
    setLocalWatched((prev) => !prev);
  };

  const handleFavorited = () => {
    setLocalFavorited((prev) => !prev);
    setTimeout(() => actions.toggleFavorited(storedMovie.id), 200);
  };

  useEffect(() => {
    setLocalFavorited(!!storedMovie?.favorited);
    setLocalWatched(!!storedMovie?.watched);
  }, [storedMovie?.favorited, storedMovie?.watched]);

  return (
    <View className="flex-row h-[40] items-center justify-center px-3">
      <MDBackground />
      <DatePicker
        modal
        open={open}
        date={pickerDate}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          handleWatchedDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Pressable
        onPress={() => handleWatched()}
        onLongPress={() => setOpen(true)}
        className="flex-row items-center"
      >
        {/* Reserve space for icons */}
        <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
          {localWatched ? (
            <Animated.View
              key="eye"
              entering={selectedIconEntering}
              exiting={selectedIconExiting}
              style={{ position: "absolute" }}
            >
              <Eye className="color-black" fill={colors.includeGreen} size={30} strokeWidth={1} />
            </Animated.View>
          ) : (
            <Animated.View
              key="eye-off"
              entering={unselectedIconEntering}
              exiting={unselectedIconExiting}
              style={{ position: "absolute" }}
            >
              <EyeOff className="color-black" fill={"white"} size={25} strokeWidth={1} />
            </Animated.View>
          )}
        </View>
        {/* Text flows normally */}
        <Text className="text-black font-semibold px-2">Watched?</Text>
      </Pressable>

      <View className="mx-3" />
      <Pressable onPress={handleFavorited} className="flex-row items-center">
        {/* Reserve space for icons */}
        <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
          {localFavorited ? (
            <Animated.View
              key="on"
              entering={selectedIconEntering}
              exiting={selectedIconExiting}
              style={{ position: "absolute" }}
            >
              <Sparkles className="color-black" fill={"yellow"} size={30} strokeWidth={1} />
            </Animated.View>
          ) : (
            <Animated.View
              key="off"
              entering={unselectedIconEntering}
              exiting={unselectedIconExiting}
              style={{ position: "absolute" }}
            >
              <Sparkle className="color-black" fill="white" size={25} strokeWidth={1} />
            </Animated.View>
          )}
        </View>
        {/* Text flows normally */}
        <Text className="text-black font-semibold px-2">Favorite?</Text>
      </Pressable>
    </View>
  );
};

export default MDFavWatched;
