import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";
import { useCustomTheme } from "@/lib/colorThemes";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
type Props = {
  movieId: number | undefined;
  removeShow: (id: number) => void;
};

const MDDeleteButton = ({ movieId, removeShow }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { colors } = useCustomTheme();
  const router = useRouter();

  const handleDelete = async () => {
    if (isProcessing || !movieId) return;

    try {
      setIsProcessing(true);

      const yesDelete = await showConfirmationPrompt("Delete Movie", "Delete Movie");

      if (yesDelete && movieId) {
        removeShow(movieId);
        // Navigate back to the desired screen
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
    } finally {
      setIsProcessing(false);
      // If we are deep in a stack go back to starting point
      router.dismissAll();
    }
  };

  return (
    <TouchableOpacity
      disabled={isProcessing}
      onPress={handleDelete}
      className={`flex flex-row items-center px-2 mr-[-10] pl-1 ${
        isProcessing ? "opacity-50" : ""
      }`}
    >
      <SymbolView name="trash" tintColor={colors.deleteRed} size={30} />
    </TouchableOpacity>
  );
};

export default MDDeleteButton;
