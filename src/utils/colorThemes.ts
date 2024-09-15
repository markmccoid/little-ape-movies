import { DefaultTheme, DarkTheme, Theme, useTheme } from "@react-navigation/native";

type CustomTheme = Theme & {
  colors: Theme["colors"] & {
    secondary: string;
    button: string;
    buttontext: string;
    textInverted: string;
    cardInverted: string;
    colorSelected: string;
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
    primary: "#0e203d",
    secondary: "#b9d0f9",
    background: "#ebebf0",
    card: "#fbfbfe",
    cardInverted: "#010104",
    text: "#040316",
    textInverted: "#eae9fc",
    border: "#09080c", // Make border same as primary??
    // border: "#262323",
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#90ee90",
    notification: "rgb(255, 59, 48)",
  },
};

export const CustomDarkTheme: CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#a0b7db",
    secondary: "#0e203d",
    background: "#0f0f14",
    card: "#010104",
    cardInverted: "#fbfbfe",
    text: "#fbfbfe",
    textInverted: "#040316",
    border: "#eae9fc",
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#2f6b2f",
    notification: "rgb(255, 59, 48)",
  },
};
