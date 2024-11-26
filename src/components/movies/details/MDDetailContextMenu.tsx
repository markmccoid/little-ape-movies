import * as Linking from "expo-linking";
import * as ContextMenu from "zeego/context-menu";
import { View, Text } from "react-native";
import React from "react";
import { nativeShareItem } from "@/utils/utils";

type Props = {
  shareLink: string;
  movieId: number;
  movieTitle: string;
  children: React.ReactElement; // A single React element
};

const MDDetailContextMenu = ({ shareLink, movieId, movieTitle, children }: Props) => {
  // console.log("shareLink", shareLink);
  // console.log("createURL", Linking.createURL(`/search/${movieId}`));
  const handleShare = () =>
    nativeShareItem({
      message: `Open and Search in Little Ape Movies -> \n${Linking.createURL(
        `/search/${movieId}`
      )}`,
      url: shareLink,
    });
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="author" onSelect={handleShare}>
          <ContextMenu.ItemTitle>{`Share ${movieTitle}`}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "square.and.arrow.up",
              pointSize: 18,
              weight: "semibold",
              scale: "medium",
            }}
          ></ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export default MDDetailContextMenu;
