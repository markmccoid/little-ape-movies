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
        text: {
          DEFAULT: "var(--color-text)",
          inverted: "var(--color-text-inverted)",
        },
        textinput: {
          DEFAULT: "var(--color-textinput)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          inverted: "var(--color-card-inverted)",
        },

        border: "var(--color-border)",
        button: "var(--color-button)",
        buttontext: "var(--color-button-text)",
        selected: "var(--color-selected)",
        overlay: "var(--color-overlay)",
        imdbyellow: "var(--color-imdb-yellow)",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
