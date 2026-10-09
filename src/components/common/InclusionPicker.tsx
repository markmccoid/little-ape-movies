import React from "react";
import { Host, Picker, Text } from "@expo/ui/swift-ui";
import { labelsHidden, pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import { useColorScheme } from "@/lib/useColorScheme";
import { InclusionState } from "@/store/store.settings";

export const watchedInclusionOptions = [
  { value: "off", label: "Ignore" },
  { value: "include", label: "Watched" },
  { value: "exclude", label: "Unwatched" },
] as const satisfies readonly { value: InclusionState; label: string }[];

export const favoriteInclusionOptions = [
  { value: "off", label: "Ignore" },
  { value: "include", label: "Favorites" },
  { value: "exclude", label: "Exclude Favs" },
] as const satisfies readonly { value: InclusionState; label: string }[];

interface InclusionOption {
  value: InclusionState;
  label: string;
}

interface InclusionPickerProps {
  label: string;
  options: readonly InclusionOption[];
  value: InclusionState | undefined;
  onChange: (value: InclusionState) => void;
}

function isInclusionState(value: string | number | null): value is InclusionState {
  return value === "off" || value === "include" || value === "exclude";
}

const InclusionPicker: React.FC<InclusionPickerProps> = ({ label, options, value, onChange }) => {
  const { colorScheme } = useColorScheme();
  const selection = value ?? "off";

  const handleSelectionChange = (next: string | number | null) => {
    if (isInclusionState(next) && next !== selection) {
      onChange(next);
    }
  };

  return (
    <Host
      colorScheme={colorScheme === "light" ? "light" : "dark"}
      style={{ width: "100%", height: 36 }}
    >
      <Picker
        label={label}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        modifiers={[pickerStyle("segmented"), labelsHidden()]}
      >
        {options.map((option) => (
          <Text key={option.value} modifiers={[tag(option.value)]}>
            {option.label}
          </Text>
        ))}
      </Picker>
    </Host>
  );
};

export default InclusionPicker;
