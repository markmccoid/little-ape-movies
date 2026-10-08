import { View, Text, Switch, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultSortSettings } from "@/store/sortSettings";
import { Button } from "../../ui/button";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useCustomTheme } from "@/lib/colorThemes";
import useSettingsStore, { SortField, useSettingsActions } from "@/store/store.settings";
import { Input } from "../../ui/input";
import uuid from "react-native-uuid";
import { sortBy } from "lodash";
import DragDropEntry from "@/components/common/DragAndSort/DragDropEntry";
import { Positions, sortArray } from "@/components/common/DragAndSort/helperFunctions";
import { SymbolView } from "expo-symbols";

const ROW_HEIGHT = 45;

type SortDirection = "asc" | "desc";

type SortDirectionLabelProps = {
  active: boolean;
  direction: SortDirection;
};

const SortDirectionLabel: React.FC<SortDirectionLabelProps> = ({ active, direction }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0.25, { duration: 750 });
  }, [active, direction, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      className={active ? "text-card-foreground" : "text-muted-foreground"}
      style={animatedStyle}
    >
      {direction === "asc" ? "Low to High" : "High to Low"}
    </Animated.Text>
  );
};

type SortDirectionArrowProps = {
  direction: SortDirection;
  tintColor: string;
};

const SortDirectionArrow: React.FC<SortDirectionArrowProps> = ({ direction, tintColor }) => {
  const rotation = useSharedValue(direction === "asc" ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(direction === "asc" ? 0 : 180, { duration: 600 });
  }, [direction, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View className="rounded-full" style={animatedStyle}>
      <SymbolView name="arrowshape.down" tintColor={tintColor} />
    </Animated.View>
  );
};

type Props = {
  handleNewSort: (newSort: SortField[]) => void;
  initSort: SortField[];
};
const SortEditor = ({ handleNewSort, initSort }: Props) => {
  const actions = useSettingsActions();
  const existing = useSettingsStore((state) => state.savedQuickSorts);
  const { colors } = useCustomTheme();
  const [newSort, setNewSort] = useState(initSort?.length === 0 ? defaultSortSettings : initSort);

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

  useEffect(() => {
    setNewSort(initSort?.length === 0 ? defaultSortSettings : initSort);
  }, [initSort]);

  useEffect(() => {
    // This is the final sort that will be sent to the parent
    // Let's order it so that the active items are first

    newSort.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
    // Reset the index property (yes, the index property is not really needed if we trust the array order, but
    // our DragDropEntry component needs it)
    for (let [index, sortObj] of newSort.entries()) {
      sortObj.index = index;
    }
    // call parent sort save function
    handleNewSort(sortBy(newSort, "index"));
  }, [newSort]);

  return (
    <View className="mx-2 mt-4">
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
                className={`flex-row items-center  ${sort.active ? "opacity-100" : "opacity-35"}`}
              >
                <View>
                  <SortDirectionLabel
                    key={sort.sortDirection}
                    active={sort.active}
                    direction={sort.sortDirection}
                  />
                </View>

                <View className="w-[35] items-center">
                  <SortDirectionArrow
                    direction={sort.sortDirection}
                    tintColor={colors.includeGreen}
                  />
                </View>
              </Pressable>
            </View>
          );
        })}
      </DragDropEntry>
    </View>
  );
};

export default SortEditor;
