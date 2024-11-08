import { DefaultTheme, DarkTheme, Theme, useTheme } from "@react-navigation/native";

//! Custom Hook for typesafe colors
//~ Usage - const {colors} = useCustomTheme();
export function useCustomTheme() {
  return useTheme() as CustomTheme;
}
// ---------------------------
type CustomTheme = Theme & {
  colors: Theme["colors"] & {
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    button: string;
    buttontext: string;
    textInverted: string;
    textInput: string;
    cardInverted: string;
    cardForeground: string;
    colorSelected: string;
    deleteRed: string;
    imdbYellow: string;
  };
};

// The themes below are imported into the root _layout.tsx file and
// send to React Navigation so they can be used by react navigation
// This also puts all the custom colors in the useTheme() hook from react navigation
// We export a new useCustomTheme() so we can get our custom colors to show up in typescript intell
export const CustomLightTheme: CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7c3aed",
    primaryForeground: "#F9FAFB",
    secondary: "#c5b8d1",
    secondaryForeground: "#030712",
    background: "#ebebf0",
    card: "#fbfbfe",
    cardForeground: "#030712",
    cardInverted: "#010104",
    text: "#040316",
    textInput: "#dfdfdf",
    textInverted: "#eae9fc",
    border: "#09080c", // Make border same as primary??
    // border: "#262323",
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#90ee90",
    notification: "rgb(255, 59, 48)",
    deleteRed: "#c70000",
    imdbYellow: "#ECC233",
  },
};

export const CustomDarkTheme: CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#7c3aed",
    primaryForeground: "#030712",
    secondary: "#c5b8d1",
    secondaryForeground: "#F9FAFB",
    background: "#3D3649",
    card: "#241E2F",
    cardForeground: "#F9FAFB",
    cardInverted: "#fbfbfe",
    text: "#fbfbfe",
    textInput: "#4d595d",
    textInverted: "#040316",
    border: "#eae9fc",
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#2f6b2f",
    notification: "rgb(255, 59, 48)",
    deleteRed: "#c70000",
    imdbYellow: "#ECC233",
  },
};
