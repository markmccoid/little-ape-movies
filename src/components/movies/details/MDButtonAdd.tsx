import React, { useState } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { useCustomTheme } from "@/utils/colorThemes";
import { SymbolView } from "expo-symbols";
type Props = {
  addShow: () => void;
};

const MDButtonAdd = ({ addShow }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { colors } = useCustomTheme();
  const handleAdd = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    // Since addShow is not async and it takes a while, await a fake promise so isProcessing can take effect
    await new Promise((resolve) => setTimeout(() => resolve("done"), 0));
    try {
      addShow();

      // Navigate back to the desired screen
    } catch (error) {
      console.error("Add operation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={isProcessing}
      onPress={handleAdd}
      className={`flex flex-row items-center px-2 mr-[-10] pl-1 ${
        isProcessing ? "opacity-50" : ""
      }`}
    >
      {isProcessing ? (
        <ActivityIndicator size="small" />
      ) : (
        <SymbolView name="plus.app" tintColor={colors.text} size={30} />
      )}
    </TouchableOpacity>
  );
};

export default MDButtonAdd;
