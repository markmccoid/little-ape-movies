import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Sparkle } from "@/lib/icons/Sparkle";
import { Sparkles } from "@/lib/icons/Sparkles";
import { EyeOff } from "@/lib/icons/EyeOff";
import { Eye } from "@/lib/icons/Eye";
import MDBackground from "../MDBackground";
import { ShowItemType, useMovieActions } from "@/store/store.shows";
import { Text } from "@/components/ui/text";
import { useCustomTheme } from "@/lib/colorThemes";
import { AnimatePresence, MotiView } from "moti";

type Props = {
  storedMovie: ShowItemType | undefined;
};
const MDFavWatched = ({ storedMovie }: Props) => {
  const actions = useMovieActions();
  const { colors } = useCustomTheme();
  const [localWatched, setLocalWatched] = useState(!!storedMovie?.watched);
  const [localFavorited, setLocalFavorited] = useState(!!storedMovie?.favorited);
  if (!storedMovie?.id) return;

  const handleWatched = () => {
    setLocalWatched((prev) => !!!prev);
    setTimeout(() => actions.toggleWatched(storedMovie.id), 200);
  };

  const handleFavorited = () => {
    setLocalFavorited((prev) => !!!prev);
    setTimeout(() => actions.toggleFavorited(storedMovie.id), 200);
  };

  useEffect(() => {
    setLocalFavorited(!!storedMovie?.favorited);
    setLocalWatched(!!storedMovie?.watched);
  }, [storedMovie?.favorited, storedMovie?.watched]);

  return (
    <View className="flex-row h-[40] items-center justify-center px-3">
      <MDBackground />
      <Pressable onPress={handleWatched} className="flex-row items-center">
        {/* Reserve space for icons */}
        <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
          <AnimatePresence>
            {localWatched ? (
              <MotiView
                key="eye"
                from={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1.2,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{ position: "absolute" }}
              >
                <Eye className="color-black" fill={colors.includeGreen} size={30} strokeWidth={1} />
              </MotiView>
            ) : (
              <MotiView
                key="eye-off"
                from={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{ position: "absolute" }}
              >
                <EyeOff className="color-black" fill={"white"} size={25} strokeWidth={1} />
              </MotiView>
            )}
          </AnimatePresence>
        </View>
        {/* Text flows normally */}
        <Text className="text-black font-semibold px-2">Watched?</Text>
      </Pressable>

      <View className="mx-3" />
      <Pressable onPress={handleFavorited} className="flex-row items-center">
        {/* Reserve space for icons */}
        <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
          <AnimatePresence>
            {localFavorited ? (
              <MotiView
                key="on"
                from={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1.2,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{ position: "absolute" }}
              >
                <Sparkles className="color-black" fill={"yellow"} size={30} strokeWidth={1} />
              </MotiView>
            ) : (
              <MotiView
                key="off"
                from={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{ position: "absolute" }}
              >
                <Sparkle className="color-black" fill="white" size={25} strokeWidth={1} />
              </MotiView>
            )}
          </AnimatePresence>
        </View>
        {/* Text flows normally */}
        <Text className="text-black font-semibold px-2">Favorite?</Text>
      </Pressable>
    </View>
  );
};

export default MDFavWatched;
