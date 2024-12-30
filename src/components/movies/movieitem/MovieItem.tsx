import { View, Pressable } from "react-native";
import React, { useCallback, useEffect, useReducer } from "react";
import { useRouter } from "expo-router";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import { getMovieItemSizing } from "./movieItemHelpers";
import MovieImage from "@/components/common/MovieImage";
import ActionBarContainer from "./actionbar/ActionBarContainer";
import { useCustomTheme } from "@/lib/colorThemes";
import ActionBarDelete from "./actionbar/ActionBarDelete";
import * as Haptics from "expo-haptics";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const availableWidth = screenWidth - 20; // Subtract left and right margins
// const numColumns = 2; // For a 2-column layout
// const gapWidth = 10; // Gap between images
// const imageWidth = screenWidth / 2.2; // (availableWidth - (numColumns - 1) * gapWidth) / numColumns;
// const imageHeight = imageWidth * 1.5;
type Props = {
  movie: ShowItemType;
  hideAll: boolean;
  column: 0 | 1;
  // handleHideActionBar: (arg: boolean) => void;
};
const MovieItem = ({ movie, hideAll, column }: Props) => {
  const { imageHeight, imageWidth, verticalMargin, extraHeight, horizontalMargin, gap } =
    getMovieItemSizing();
  const router = useRouter();
  const pending = useMovieStore((state) => state.pendingChanges);
  const { colors } = useCustomTheme();
  const noPending = Object.keys(pending).length === 0;
  const [actionBarShown, toggleActionBarShown] = useReducer((state) => !state, false);
  const handleActionBarShown = useCallback(() => toggleActionBarShown(), []);

  const handleActionBarToggle = () => {
    if (actionBarShown) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleActionBarShown();
  };
  // console.log("noPending in Movie Item", movie.title, noPending);
  //- when hideAll is true OR there are no pending changes, close the actionBar if it is showing
  useEffect(() => {
    if (hideAll || noPending) {
      if (actionBarShown) {
        toggleActionBarShown();
      }
    }
  }, [hideAll, noPending]);

  //~ --- handleMovieSelect ---
  const handleMovieSelect = () => {
    // Prevent further presses if a movie is already loading
    // setIsMovieLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 0));
      // Navigate to the movie's detail page
      router.push({
        pathname: `/(auth)/(drawer)/(tabs)/home/[showId]`,
        params: { showId: movie.id },
      });

      // if (actionBarShown) {
      //   toggleActionBarShown();
      // }
    } catch (error) {
      // Reset loading state after navigation completes
      console.log("Error navigating to movie detail (MovieItem.tsx)");
    }
  };

  return (
    <View
      style={{
        shadowColor: colors.text,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3,
        overflow: "visible",
      }}
    >
      <ActionBarDelete movieId={movie.id} actionBarShown={actionBarShown} />
      <View
        className="relative border-hairline border-border"
        style={{
          borderRadius: 10,
          overflow: "hidden",
          marginVertical: verticalMargin,
          marginRight: gap,
          height: imageHeight,
        }}
      >
        {/* ACTION BAR */}

        <ActionBarContainer
          movie={movie}
          isVisible={actionBarShown}
          toggleVisibility={handleActionBarShown}
          column={column}
        />

        <Pressable onPress={handleMovieSelect} onLongPress={handleActionBarToggle}>
          <MovieImage
            posterURL={movie?.posterURL}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            title={movie?.title}
            resizeMode="contain"
            imageStyle={
              {
                // borderRadius: 10,
                // borderBottomLeftRadius: 0,
                // borderBottomRightRadius: 0,
                // overflow: "hidden",
              }
            }
          />
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(MovieItem);
