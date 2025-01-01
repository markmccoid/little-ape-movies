import { View, Text, Switch, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultSortSettings } from "@/store/sortSettings";
import { Button } from "../../ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import useSettingsStore, { SortField, useSettingsActions } from "@/store/store.settings";
import { Input } from "../../ui/input";
import uuid from "react-native-uuid";
import { sortBy } from "lodash";
import DragDropEntry from "@/components/common/DragAndSort/DragDropEntry";
import { Positions, sortArray } from "@/components/common/DragAndSort/helperFunctions";
import { SymbolView } from "expo-symbols";
import { MotiText, MotiView } from "moti";
import SortEditor from "./SortEditor";

const ROW_HEIGHT = 45;

type Props = {
  handleHide: () => void;
  editId: string | undefined;
};
const QuickSortAddNew = ({ handleHide, editId }: Props) => {
  const actions = useSettingsActions();
  const existing = useSettingsStore((state) => state.savedQuickSorts);
  const { colors } = useCustomTheme();
  const [newSort, setNewSort] = useState(defaultSortSettings);
  const [initSort, setInitSort] = useState<SortField[]>(defaultSortSettings);
  const [newQSName, setNewQSName] = useState("");
  const [QSId, setQSId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!editId) return;

    const current = existing.find((el) => el.id === editId);
    if (!current) return;

    const currentSort = sortBy(current?.sort, "index");
    setNewSort(currentSort);
    setInitSort(currentSort);
    setNewQSName(current?.name);
    setQSId(current.id);
  }, [editId]);

  //~ Update Local values
  const handleLocalSortUpdate = ({
    id,
    index,
    sortDirection,
    active,
  }: {
    id: string;
    index: number;
    sortDirection: string;
    active: boolean;
  }) => {
    setNewSort((prevSorts) =>
      prevSorts.map((sortItem) => {
        if (sortItem.id === id) {
          return {
            ...sortItem,
            index: index,
            sortDirection: sortDirection as SortField["sortDirection"],
            active: active,
          };
        }
        return sortItem;
      })
    );
  };

  //~ Add New Quicksort
  const addQuickSort = () => {
    if (!newQSName) return;
    actions.addUpdateQuickSort({ id: editId || uuid.v4(), name: newQSName, sort: newSort });
    //Clear edit id
    // close quick sort add
    handleHide();
  };

  return (
    <View className="mx-2 mt-4">
      <View className="flex-row justify-center px-2 mb-1 items-center">
        <Input
          placeholder="Quick Sort Name..."
          value={newQSName}
          onChangeText={setNewQSName}
          maxLength={35}
          className="border-hairline border-border bg-card w-4/5 items-center font-semibold"
          style={{ fontSize: 16 }}
        />
      </View>
      {/* <View> */}
      <SortEditor initSort={initSort} handleNewSort={setNewSort} />

      <Animated.View
        className="flex-row px-2 mt-2 items-center justify-end "
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Button className="bg-primary mr-4" onPress={handleHide}>
          <Text className="text-primary-foreground">Cancel</Text>
        </Button>
        <Button className="bg-primary" onPress={addQuickSort}>
          <Text className="text-primary-foreground">Save</Text>
        </Button>
      </Animated.View>
    </View>
  );
};

export default QuickSortAddNew;
