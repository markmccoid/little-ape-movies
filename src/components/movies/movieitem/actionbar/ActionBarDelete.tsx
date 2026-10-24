import { View, Text, Pressable } from "react-native";
import React from "react";
import { SymbolView } from "expo-symbols";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import { useMovieActions } from "@/store/store.shows";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { eventBus } from "@/store/eventBus";

/**
 * Called from MovieItem.tsx -
 */
type Props = {
  movieId: number;
  actionBarShown: boolean;
};
const ActionBarDelete = ({ movieId, actionBarShown }: Props) => {
  const actions = useMovieActions();
  const handleDelete = async () => {
    if (!movieId) return;
    try {
      const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");

      if (yesDelete && movieId) {
        // setIsProcessing(true);
        // await new Promise((resolve) => setTimeout(() => resolve("done"), 0));
        await actions.removeShow(movieId);
        // Navigate back to the desired screen
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
    } finally {
      requestIdleCallback(() => eventBus.publish("TAG_SEARCH_RESULTS"));
    }
  };

  return (
    <View pointerEvents="box-none">
      {actionBarShown && (
        <Animated.View
          entering={FadeIn.duration(600)}
          exiting={FadeOut.duration(600)}
          className="absolute top-[0] right-[4] z-50"
          style={{ zIndex: 50 }}
        >
          <Pressable onPress={handleDelete} className="px-1 py-2 bg-muted rounded-full border-hairline">
            <SymbolView name="trash.fill" tintColor={"red"} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default ActionBarDelete;
