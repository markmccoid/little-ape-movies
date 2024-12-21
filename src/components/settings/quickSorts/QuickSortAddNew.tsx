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
  const [newQSName, setNewQSName] = useState("");
  const [QSId, setQSId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!editId) return;

    const current = existing.find((el) => el.id === editId);
    if (!current) return;

    const currentSort = sortBy(current?.sort, "index");
    setNewSort(currentSort);
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
      <DragDropEntry
        scrollStyles={{
          width: "100%",
          maxHeight: ROW_HEIGHT * 5,
          borderWidth: 1,
          borderColor: "#aaa",
        }}
        updatePositions={(positions) =>
          setNewSort((prevSort) => sortArray(positions, prevSort, { positionField: "index" }))
        }
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={ROW_HEIGHT}
        handlePosition="left"
        //handle={MyHandle} // This is optional.  leave out if you want the default handle
        enableDragIndicator={true}
      >
        {newSort.map((sort, index) => {
          return (
            <View
              key={sort.id}
              id={sort.id}
              className={`border-border border-hairline flex-row items-center justify-between ${
                sort.active ? "bg-card" : "bg-muted"
              }`}
              style={{
                height: ROW_HEIGHT,
                // backgroundColor: sort.active ? colors.card : "#ddd",
              }}
            >
              <View className="flex-row items-center flex-grow justify-between mr-10">
                <Text
                  className={`font-semibold px-2 ${
                    sort.active ? "text-card-foreground" : "text-muted-foreground"
                  }`}
                  numberOfLines={1}
                  style={{ opacity: sort.active ? 1 : 0.5 }}
                >
                  {sort.title}
                </Text>
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
              </View>
              {/* SORT Description */}
              <MotiView>
                {sort.sortDirection === "asc" ? (
                  <MotiText
                    className={`${
                      sort.active ? "text-card-foreground" : "text-muted-foreground opacity-25"
                    }`}
                    key={1}
                    from={{ opacity: 0 }}
                    animate={{ opacity: sort.active ? 1 : 0.25 }}
                    transition={{ type: "timing", duration: 750 }}
                  >
                    Low to High
                  </MotiText>
                ) : (
                  <MotiText
                    className={`${
                      sort.active ? "text-card-foreground" : "text-muted-foreground opacity-0"
                    }`}
                    key={2}
                    from={{ opacity: 0 }}
                    animate={{ opacity: sort.active ? 1 : 0.25 }}
                    transition={{ type: "timing", duration: 750 }}
                  >
                    High to Low
                  </MotiText>
                )}
              </MotiView>
              <Pressable
                disabled={!sort.active}
                onPress={() =>
                  handleLocalSortUpdate({
                    id: sort.id,
                    active: sort.active,
                    index: sort.index,
                    sortDirection: sort.sortDirection === "asc" ? "desc" : "asc",
                  })
                }
                className={`flex-row items-center w-[35] justify-between ${
                  sort.active ? "opacity-100" : "opacity-35"
                }`}
              >
                <MotiView
                  from={{
                    rotate: sort.sortDirection === "asc" ? "180deg" : "0deg",
                    // backgroundColor: sort.sortDirection === "asc" ? "red" : "white",
                  }}
                  animate={{
                    rotate: sort.sortDirection === "asc" ? "0deg" : "180deg",
                    // backgroundColor: sort.sortDirection === "asc" ? "white" : "red",
                  }}
                  transition={{ type: "timing", duration: 600 }}
                  className="rounded-full"
                >
                  <SymbolView name="arrowshape.down" tintColor={colors.includeGreen} />
                </MotiView>
              </Pressable>
            </View>
          );
        })}
      </DragDropEntry>

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
