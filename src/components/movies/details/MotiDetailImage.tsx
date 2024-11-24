import useDetailImageSize from "@/hooks/useDetailImageSize";
import { MotiImage, MotiView } from "moti";
import React from "react";

type Props = {
  existsInSaved: boolean;
  posterURL: string | undefined;
};
/**
 *
 */
const MotiDetailImage = ({ existsInSaved, posterURL }: Props) => {
  // All of the shouldRender/requestAnimation frame is to try and get the animation
  // of the radius to be smooth.
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => {
      setShouldRender(true);
    });
    return () => {
      setShouldRender(false);
    };
  }, [existsInSaved]);

  const { imageWidth, imageHeight } = useDetailImageSize();
  // Radius once added
  const BORDER_RADIUS_ADDED = 20;
  // Radius when NOT added
  const BORDER_RADIUS_SEARCH = 45;
  return (
    <MotiView
      className=""
      from={{
        borderRadius: existsInSaved && shouldRender ? BORDER_RADIUS_SEARCH : BORDER_RADIUS_ADDED,
        opacity: 0.5,
        // translateX: -100,
      }}
      animate={{
        borderRadius: existsInSaved && shouldRender ? BORDER_RADIUS_ADDED : BORDER_RADIUS_SEARCH,
        opacity: 1,
        // translateX: 0,
      }}
      transition={{
        type: "timing",
        duration: 600,
      }}
      style={{
        width: imageWidth,
        height: imageHeight,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      }}
    >
      <MotiImage
        source={{ uri: posterURL }}
        from={{
          borderRadius: existsInSaved && shouldRender ? BORDER_RADIUS_SEARCH : BORDER_RADIUS_ADDED,
        }}
        animate={{
          borderRadius: existsInSaved && shouldRender ? BORDER_RADIUS_ADDED : BORDER_RADIUS_SEARCH,
        }}
        transition={{
          type: "timing",
          duration: 600,
        }}
        style={{
          width: imageWidth,
          height: imageHeight,
          resizeMode: "contain",
        }}
      />
    </MotiView>
  );
};

export default MotiDetailImage;
