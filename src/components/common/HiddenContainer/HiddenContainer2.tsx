import React, { ReactNode, useState } from "react";
import { StyleSheet, Text, View, Pressable, ViewStyle } from "react-native";
import { ExpandDownIcon, CollapseUpIcon } from "@/components/common/Icons";
import { AnimatePresence, MotiView } from "moti";

/**
 * Component will take a component as a child and toggle displaying or hiding
 * the content.
 * Will accept a passed "title" prop to display as title
 * Will also accept "startOpen" prop to determine if container is in
 * open state when initially displayed.
 *
 */
type Props = {
  children: ReactNode;
  title: string;
  height: number;
  style?: ViewStyle;
  startOpen?: boolean;
};

const HiddenContainer: React.FC<Props> = ({
  children,
  style,
  title,
  height,
  startOpen = false,
}) => {
  const [viewContents, setViewContents] = useState(startOpen);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff85",
        borderTopColor: "#777",
        borderBottomColor: "#aaa",
        borderBottomWidth: viewContents ? 1 : 1,
        borderTopWidth: 1,
        marginVertical: 5,
      }}
      className="pt-2"
    >
      <Pressable
        style={({ pressed }) => [
          {
            flex: 1,
            paddingVertical: 10,
            borderBottomColor: "#777",
            borderBottomWidth: 1,
            backgroundColor: "#ffffff77",
            opacity: pressed ? 0.6 : 1,
          },
        ]}
        onPress={() => setViewContents((prev) => !prev)}
      >
        <View className="flex-row justify-between">
          <View className="pl-4">
            <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: 15 }}>{title}</Text>
          </View>
          <View className="pr-4">
            <MotiView
              key="1"
              from={{ transform: [{ rotateZ: viewContents ? "0deg" : "180deg" }] }}
              animate={{ transform: [{ rotateZ: viewContents ? "180deg" : "0deg" }] }}
            >
              <ExpandDownIcon style={{ marginTop: 5 }} size={20} />
            </MotiView>
          </View>
        </View>
      </Pressable>

      <MotiView
        from={{ height: viewContents ? 0 : height }}
        animate={{ height: viewContents ? height : 0 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <AnimatePresence>
          {viewContents && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={1}>
              {children}
            </MotiView>
          )}
        </AnimatePresence>
      </MotiView>
    </View>
  );
};

export default HiddenContainer;

const styles = StyleSheet.create({});
