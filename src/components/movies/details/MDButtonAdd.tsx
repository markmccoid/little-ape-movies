import React, { useState } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { useCustomTheme } from "@/lib/colorThemes";
import { SymbolView } from "expo-symbols";
type Props = {
  addShow: () => Promise<void>;
};

const MDButtonAdd = ({ addShow }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { colors } = useCustomTheme();
  const handleAdd = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(() => resolve("done"), 0));
    await addShow();
    setIsProcessing(false);
  };

  if (isProcessing) {
    return <ActivityIndicator size="small" />;
  }
  return (
    <TouchableOpacity
      disabled={isProcessing}
      onPress={handleAdd}
      className={`flex flex-row items-center px-2 mr-[-10] pl-1 ${
        isProcessing ? "opacity-50" : ""
      }`}
    >
      <SymbolView name="plus.app" tintColor={colors.text} size={30} />
    </TouchableOpacity>
  );
};

export default MDButtonAdd;
