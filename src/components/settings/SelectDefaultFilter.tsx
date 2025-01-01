import useSettingsStore from "@/store/store.settings";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";

function SelectDefaultFilter() {
  const insets = useSafeAreaInsets();
  const filters = useSettingsStore((state) => state.savedFilters);
  const defaultFilterId = useSettingsStore((state) => state.defaultFilter);
  const setDefaultFilter = useSettingsStore((state) => state.actions.setDefaultFilter);
  const defaultFilter = filters.find((filter) => filter.id === defaultFilterId) || {};
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select
      defaultValue={{ label: defaultFilter.name, value: defaultFilterId }}
      className="flex-row items-center mx-4 mt-5"
      onValueChange={(option) => setDefaultFilter(option?.value || "")}
    >
      <Text className="font-semibold text-lg mr-2">Default Filter</Text>
      <SelectTrigger className="w-[250px] bg-card border-border border-hairline">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder="Select a Default Filter"
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          {filters.map((filter) => (
            <SelectItem key={filter.id} label={filter.name} value={filter.id}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export default SelectDefaultFilter;
