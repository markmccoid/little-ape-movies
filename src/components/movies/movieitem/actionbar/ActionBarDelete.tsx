import { View, Text, Pressable, InteractionManager } from "react-native";
import React from "react";
import { SymbolView } from "expo-symbols";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import { useMovieActions } from "@/store/store.shows";
import { AnimatePresence, MotiView } from "moti";
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
      InteractionManager.runAfterInteractions(() => eventBus.publish("TAG_SEARCH_RESULTS"));
    }
  };

  return (
    <AnimatePresence>
      {actionBarShown && (
        <Pressable onPress={handleDelete} style={{ zIndex: 50 }}>
          <MotiView
            key="trash-button" // Use a key to help AnimatePresence track changes
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 600 }}
            className="absolute top-[0] right-[4] z-50 px-1 py-2 bg-muted rounded-full border-hairline"
          >
            <SymbolView name="trash.fill" tintColor={"red"} />
          </MotiView>
        </Pressable>
      )}
    </AnimatePresence>
  );
};

export default ActionBarDelete;
