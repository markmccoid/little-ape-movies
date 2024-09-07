/** @type {import('tailwindcss').Config} */
const { hairlineWidth } = require("nativewind/theme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        background: {
          DEFAULT: "var(--color-background)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
        },
        text: "var(--color-text)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        button: "var(--color-button)",
        buttontext: "var(--color-button-text)",
        overlay: "var(--color-overlay)",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
