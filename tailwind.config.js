/** @type {import('tailwindcss').Config} */
const { hairlineWidth } = require("nativewind/theme");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))", // RNR Colors
          foreground: "hsl(var(--primary-foreground))", // RNR Colors
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // RNR Colors
          foreground: "hsl(var(--secondary-foreground))", // RNR Colors
        },
        background: {
          DEFAULT: "hsl(var(--background))", // RNR Colors (takes precedence)
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // RNR Colors (takes precedence)
          foreground: "hsl(var(--accent-foreground))", // RNR Colors
        },
        card: {
          DEFAULT: "hsl(var(--card))", // RNR Colors (takes precedence)
          foreground: "hsl(var(--card-foreground))", // RNR Colors
        },
        border: "hsl(var(--border))", // RNR Colors (takes precedence)
        selected: "var(--color-selected)", // Keep this as it's not in RNR Colors
        overlay: "var(--color-overlay)", // Keep this as it's not in RNR Colors
        imdbyellow: "var(--color-imdb-yellow)", // Keep this as it's not in RNR Colors

        input: "hsl(var(--input))", // RNR Colors
        ring: "hsl(var(--ring))", // RNR Colors
        foreground: "hsl(var(--foreground))", // RNR Colors

        destructive: {
          DEFAULT: "hsl(var(--destructive))", // RNR Colors
          foreground: "hsl(var(--destructive-foreground))", // RNR Colors
        },

        muted: {
          DEFAULT: "hsl(var(--muted))", // RNR Colors
          foreground: "hsl(var(--muted-foreground))", // RNR Colors
        },

        popover: {
          DEFAULT: "hsl(var(--popover))", // RNR Colors
          foreground: "hsl(var(--popover-foreground))", // RNR Colors
        },
      },
    },
  },

  plugins: [],
};
