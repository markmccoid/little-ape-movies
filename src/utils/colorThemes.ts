import { DefaultTheme, DarkTheme, Theme, useTheme } from "@react-navigation/native";

type CustomTheme = Theme & {
  colors: Theme["colors"] & {
    secondary: string;
    button: string;
    buttontext: string;
    textInverted: string;
    textInput: string;
    cardInverted: string;
    colorSelected: string;
    deleteRed: string;
    imdbYellow: string;
  };
};

//! Custom Hook for typesafe colors
//~ Usage - const {colors} = useCustomTheme();
export function useCustomTheme() {
  return useTheme() as CustomTheme;
}

export const CustomLightTheme: CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#192D3C",
    secondary: "#9EB5BD",
    background: "#ebebf0",
    card: "#fbfbfe",
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
    primary: "#9EB5BD",
    secondary: "#192D3C",
    background: "#0f0f14",
    card: "#010104",
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
