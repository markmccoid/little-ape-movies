import { View, Text, Switch, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultSortSettings } from "@/store/sortSettings";
import { Button } from "../ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import { SortField, useSettingsActions } from "@/store/store.settings";
import { Input } from "../ui/input";
import uuid from "react-native-uuid";

type Props = {
  handleHide: () => void;
};
const QuickSortAddNew = ({ handleHide }: Props) => {
  const actions = useSettingsActions();
  const { colors } = useCustomTheme();
  const [newSort, setNewSort] = useState(defaultSortSettings);
  const [newQSName, setNewQSName] = useState("");

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
    actions.addUpdateQuickSort({ id: uuid.v4(), name: newQSName, sort: newSort });
    // close quick sort add
    handleHide();
  };
  return (
    <View className="">
      <View className="flex-row justify-between px-2 mb-2">
        <Input
          placeholder="Quick Sort Name..."
          value={newQSName}
          onChangeText={setNewQSName}
          maxLength={30}
          className="border-hairline border-border bg-card w-1/2"
        />
        <Animated.View
          className="flex-row items-center justify-between "
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Button className="bg-primary" onPress={handleHide}>
            <Text className="text-primary-foreground">Cancel</Text>
          </Button>
          <Button className="bg-primary" onPress={addQuickSort}>
            <Text className="text-primary-foreground">Save</Text>
          </Button>
        </Animated.View>
      </View>
      <View>
        {newSort.map((sort, index) => {
          return (
            <View key={sort.id} className="border flex-row items-center">
              <Text className="text-card-foreground">{sort.title}</Text>
              <Switch
                style={{ transform: [{ scale: 0.75 }] }}
                onValueChange={(value) =>
                  handleLocalSortUpdate({
                    id: sort.id,
                    active: value,
                    index: sort.index,
                    sortDirection: sort.sortDirection,
                  })
                }
                value={sort.active}
                trackColor={{ false: colors.secondary, true: colors.primary }}
                thumbColor={sort.active ? colors.background : colors.secondary}
              />
              <Pressable
                onPress={() =>
                  handleLocalSortUpdate({
                    id: sort.id,
                    active: sort.active,
                    index: sort.index,
                    sortDirection: sort.sortDirection === "asc" ? "desc" : "asc",
                  })
                }
              >
                <Text>{sort.sortDirection}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default QuickSortAddNew;
