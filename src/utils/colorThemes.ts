import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0e203d",
    secondary: "#b9d0f9",
    background: "#ebebf0",
    card: "#fbfbfe",
    text: "#040316",
    border: "#0e203d", // Make border same as primary??
    // border: "#262323",
    button: "#9fb6db",
    buttontext: "#040316",
    notification: "rgb(255, 59, 48)",
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#a0b7db",
    secondary: "#0e203d",
    background: "#0f0f14",
    card: "#010104",
    text: "#fbfbfe",
    border: "#a0b7db",
    button: "#9fb6db",
    buttontext: "#040316",
    notification: "rgb(255, 59, 48)",
  },
};
