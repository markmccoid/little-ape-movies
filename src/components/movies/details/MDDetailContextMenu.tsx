import * as Linking from "expo-linking";
import { Link, usePathname, useRouter, useSegments, type Href } from "expo-router";
import { View } from "react-native";
import React from "react";
import { nativeShareItem } from "@/utils/utils";

type Props = {
  movieId: number | undefined;
  movieTitle: string | undefined;
  imdbId: string | undefined;
  existsInSaved: boolean;
  children: React.ReactElement;
};

const MDDetailContextMenu = ({
  movieId,
  movieTitle,
  imdbId,
  existsInSaved,
  children,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const isSearchTab = (segments as readonly string[]).includes("search");
  const canShare = movieId != null && !!movieTitle;
  const canPickImage = existsInSaved && movieId != null;

  const handleShare = () => {
    if (movieId == null || !movieTitle) return;
    const deepLink = Linking.createURL(`/search/${movieId}`, {
      queryParams: { title: movieTitle },
    });
    const shareLines = ["Open and Search in Little Ape Movies ->", deepLink];
    if (imdbId) {
      shareLines.push(`IMDB: http://www.imdb.com/title/${imdbId}`);
    }
    nativeShareItem({ message: shareLines.join("\n") });
  };

  const handlePickImage = () => {
    if (movieId == null) return;
    const pathname = isSearchTab
      ? "/search/[showId]/detailimagemodal"
      : "/home/[showId]/detailimagemodal";
    router.navigate({
      pathname,
      params: { showId: String(movieId) },
    });
  };

  const preventPosterNavigation = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  if (!canShare && !canPickImage) {
    return children;
  }

  return (
    <Link href={pathname as Href} asChild onPress={preventPosterNavigation}>
      <Link.Trigger>
        <View>{children}</View>
      </Link.Trigger>
      <Link.Menu>
        {canShare ? (
          <Link.MenuAction
            title={`Share ${movieTitle}`}
            icon="square.and.arrow.up"
            onPress={handleShare}
          />
        ) : null}
        {canPickImage ? (
          <Link.MenuAction title="Pick Image" icon="photo" onPress={handlePickImage} />
        ) : null}
      </Link.Menu>
    </Link>
  );
};

export default MDDetailContextMenu;
