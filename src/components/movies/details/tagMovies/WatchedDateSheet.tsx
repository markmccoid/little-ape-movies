import React from "react";
import {
  BottomSheet,
  Button,
  DatePicker,
  Group,
  Host,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  datePickerStyle,
  font,
  foregroundStyle,
  labelsHidden,
  padding,
  preferredColorScheme,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

interface WatchedDateSheetProps {
  open: boolean;
  date: Date;
  colorScheme: "light" | "dark";
  onCancel: () => void;
  onConfirm: () => void;
  onDateChange: (date: Date) => void;
}

const WatchedDateSheet: React.FC<WatchedDateSheetProps> = ({
  open,
  date,
  colorScheme,
  onCancel,
  onConfirm,
  onDateChange,
}) => {
  const handlePresentedChange = (presented: boolean) => {
    if (!presented) {
      onCancel();
    }
  };

  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <Host
      colorScheme={colorScheme}
      pointerEvents="none"
      style={{ position: "absolute", width: 1, height: 1 }}
    >
      <BottomSheet isPresented={open} onIsPresentedChange={handlePresentedChange} fitToContents>
        <Group
          modifiers={[
            preferredColorScheme(colorScheme),
            presentationDragIndicator("visible"),
            padding({ all: 16 }),
          ]}
        >
          <VStack spacing={12}>
            <VStack spacing={2}>
              <Text
                modifiers={[
                  font({ size: 13 }),
                  foregroundStyle({ type: "hierarchical", style: "secondary" }),
                ]}
              >
                Watched date
              </Text>
              <Text
                modifiers={[
                  font({ size: 28, weight: "semibold" }),
                  foregroundStyle({ type: "hierarchical", style: "primary" }),
                ]}
              >
                {weekday}
              </Text>
            </VStack>
            <DatePicker
              title="Watched date"
              selection={date}
              displayedComponents={["date"]}
              onDateChange={onDateChange}
              modifiers={[datePickerStyle("wheel"), labelsHidden()]}
            />
            <HStack spacing={12}>
              <Button
                label="Cancel"
                role="cancel"
                onPress={onCancel}
                modifiers={[buttonStyle("bordered")]}
              />
              <Spacer />
              <Button
                label="Confirm"
                onPress={onConfirm}
                modifiers={[buttonStyle("borderedProminent")]}
              />
            </HStack>
          </VStack>
        </Group>
      </BottomSheet>
    </Host>
  );
};

export default WatchedDateSheet;
