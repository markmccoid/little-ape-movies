import * as Linking from "expo-linking";
import * as ContextMenu from "zeego/context-menu";
import { View, Text } from "react-native";
import React from "react";
import { nativeShareItem } from "@/utils/utils";
import { useRouter } from "expo-router";

type Props = {
  shareLink: string | undefined;
  movieId: number | undefined;
  movieTitle: string | undefined;
  existsInSaved: boolean;
  children: React.ReactElement; // A single React element
};

const MDDetailContextMenu = ({
  shareLink,
  movieId,
  movieTitle,
  existsInSaved,
  children,
}: Props) => {
  const router = useRouter();
  // console.log("shareLink", shareLink);
  // console.log("createURL", Linking.createURL(`/search/${movieId}`));
  const handleShare = () =>
    nativeShareItem({
      message: `Open and Search in Little Ape Movies -> \n${Linking.createURL(
        `/search/${movieId}`
      )}`,
      url: shareLink,
    });
  const handlePickImage = () => {
    router.navigate({ pathname: `./[showId]/detailimagemodal`, params: { showId: movieId } });
  };
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="share" onSelect={handleShare}>
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
        {existsInSaved && (
          <ContextMenu.Item key="changeimage" onSelect={handlePickImage}>
            <ContextMenu.ItemTitle>{`Pick Image`}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon
              ios={{
                name: "photo",
                pointSize: 18,
                weight: "semibold",
                scale: "medium",
              }}
            ></ContextMenu.ItemIcon>
          </ContextMenu.Item>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export default MDDetailContextMenu;
