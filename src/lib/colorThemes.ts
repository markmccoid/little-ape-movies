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
    destructive: string;
    destructiveForeground: string;
    deleteRed: string;
    includeGreen: string;
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
    primary: "#7b3df2", // Converted from HSL(262.1, 83.3%, 57.8%)
    primaryForeground: "#f5f9fb", // Converted from HSL(210, 20%, 98%)
    secondary: "#c3b1e6", // Converted from HSL(262, 47%, 75%)
    secondaryForeground: "#1a2230", // Converted from HSL(220.9, 39.3%, 11%)
    background: "#f0ebfa", // Converted from HSL(262, 50%, 95%)
    card: "#ffffff", // Converted from HSL(0, 0%, 100%)
    cardForeground: "#03061a", // Converted from HSL(224, 71.4%, 4.1%)
    cardInverted: "#010104",
    text: "#040316",
    textInput: "#dfdfdf",
    textInverted: "#eae9fc",
    border: "#160D26",
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#90ee90",
    notification: "rgb(255, 59, 48)",
    destructive: "#F24545",
    destructiveForeground: "#F6F9FB",
    deleteRed: "#a61000",
    includeGreen: "#6cb043",
    imdbYellow: "#ECC233",
  },
};

export const CustomDarkTheme: CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#7c5eb8", // Converted from HSL(263.4, 70%, 50.4%)
    primaryForeground: "#03061a", // Converted from HSL(224, 71.4%, 4.1%)
    secondary: "#7c5eb8", // Same as primary for dark theme (HSL conversion)
    secondaryForeground: "#f5f9fb", // Converted from HSL(210, 20%, 98%)
    background: "#3d3540", // Converted from HSL(262,15%,25%)
    card: "#2d2438", // Converted from HSL(263,22%,15%)
    cardForeground: "#f5f9fb", // Converted from HSL(210,20%,98%)
    cardInverted: "#fbfbfe",
    text: "#fbfbfe",
    textInput: "#26282d", // Converted from HSL(215,27.9%,16.9%)
    textInverted: "#040316",
    border: "#747474", // Converted from HSL(240,1%,46%)
    button: "#9fb6db",
    buttontext: "#040316",
    colorSelected: "#2f6b2f",
    notification: "rgb(255, 59, 48)",
    destructive: "#872121",
    destructiveForeground: "#F6F9FB",
    deleteRed: "#992424", // Converted from HSL(0,62.8%,30.6%)
    includeGreen: "#6cb043",
    imdbYellow: "#ECC233",
  },
};
