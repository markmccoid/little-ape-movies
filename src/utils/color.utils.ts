import { getColors } from "react-native-image-colors";
import { IOSImageColors } from "react-native-image-colors/build/types";

export type ImageColors = {
  darkestColor?: string;
  lightestColor?: string;
} & Partial<
  Record<
    "background" | "primary" | "secondary" | "detail",
    {
      color: string;
      colorType: string;
      colorLuminance: number;
      tintColor: string;
    }
  >
>;

type ColorObj = Record<
  string,
  {
    color: string;
    colorType: "dark" | "light";
    colorLuminance: number;
    tintColor: string;
  }
>;
//~ ------------------------------------------
//~ getImageColors
//~ ------------------------------------------
export const getImageColors = async (imagedata: string): Promise<ImageColors | undefined> => {
  let iosImageColors;
  try {
    iosImageColors = (await getColors(imagedata, {
      quality: "highest",
    })) as IOSImageColors;
  } catch (e) {
    console.log("getImageColors Error", e);
    return;
  }
  let imageColors = { ...iosImageColors } as IOSImageColors;
  let darkestColor = { color: "black", darkness: 0 };
  let lightestColor = { color: "white", lightness: 255 };
  // Create Color Obj
  const colorObj: ColorObj = Object.keys(imageColors).reduce((fin, key, idx) => {
    const newKey = key as keyof IOSImageColors;
    if (newKey === "quality" || newKey === "platform") return fin;
    const { colorType, colorLuminance } = getColorLuminance(imageColors[newKey]);

    if (colorType === "dark") {
      if (darkestColor?.darkness || 500 > colorLuminance) {
        darkestColor = { color: imageColors[newKey], darkness: colorLuminance };
      }
    }
    if (colorType === "light") {
      if (lightestColor?.lightness || 0 < colorLuminance) {
        lightestColor = { color: imageColors[newKey], lightness: colorLuminance };
      }
    }

    fin = {
      ...fin,
      [key]: {
        color: imageColors[newKey],
        colorType: colorType,
        colorLuminance,
        // second pass will correct these tint colors
        tintColor: colorType === "dark" ? "ffffff" : "000000",
      },
    };

    return fin;
  }, {});

  // We need to go back through and update the tint colors based on the colorType
  // and then assigning lightest or darkest color
  let newObj;
  Object.keys(colorObj).forEach((key) => {
    const colorType = colorObj[key].colorType;
    const isDark = colorType === "dark";
    const foregroundLum = isDark ? lightestColor?.lightness : darkestColor?.darkness;
    const foregroundDefault = isDark ? lightestColor?.color : darkestColor?.color;
    const foregroundOverrid = isDark ? "white" : "black";
    const contrast = getContrast(foregroundLum, colorObj[key].colorLuminance);
    // If contrast between fore and back ground luminance, then just use black or white
    const tintColor = contrast < 0.7 ? foregroundOverrid : foregroundDefault;

    newObj = {
      ...newObj,
      [key]: {
        ...colorObj[key],
        tintColor, // : colorType === "dark" ? lightestColor?.color : darkestColor?.color,
      },
    };
  });

  return { darkestColor: darkestColor?.color, lightestColor: lightestColor?.color, ...newObj };
};

//~-=======================================
//~ Take a Hex color in and return whetner
//~ the passed color is "dark" or "light"
//~-=======================================
export const getColorLuminance = (backgroundColor: string) => {
  if (!backgroundColor) return { colorType: "dark", colorLuminance: 160 };
  // Convert the hex color to RGB.
  const rgb = hexToRgb(backgroundColor);
  // Calculate the luminance of the background color.
  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  // Choose the best text color based on the luminance.

  return luminance > 150
    ? { colorType: "light", colorLuminance: luminance }
    : { colorType: "dark", colorLuminance: luminance };
};
// Function to convert a hex color to RGB.
function hexToRgb(hexColor: string) {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  return [r, g, b];
}
//~-=======================================
//~- return "white" or "black" for the text
//~~ color that should work on a color with the passed luminance
//~-=======================================
export const getTextColor = (bgLuminance: number) => {
  const whiteTextcontrast = (255 - bgLuminance) / 255;
  if (whiteTextcontrast >= 0.6) return "white";
  return "black";
};
//~- Get contrast between two color
export const getContrast = (foregroundLuminance: number, bg2Luminance: number) => {
  const contrast = (foregroundLuminance - bg2Luminance) / foregroundLuminance;
  return contrast;
};
//~~========================================
//~~ Lighten and Darken color functions
//~~========================================
export const lightenColor = (hexColor: string, magnitude: number) => {
  if (!hexColor) return "#ffffff";
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor === "white" || !hexColor) {
    hexColor = "ffffff";
  }
  if (hexColor === "black") {
    hexColor = "000000";
  }
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};

export const darkenColor = (hexColor: string, magnitude: number) => {
  if (!hexColor) return "#000000";
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor === "white") {
    hexColor = "ffffff";
  }
  if (hexColor === "black") {
    hexColor = "000000";
  }
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) - magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) - magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) - magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};
