import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // LGT brand palette (from the official LGT logo)
        lgt: {
          navy: "#283C83",
          "navy-700": "#1e2e66",
          gold: "#FFC800",
          ink: "#1a1a1a",
          mist: "#eef1f8",
        },
      },
      fontFamily: {
        head: ["Georgia", "Times New Roman", "serif"],
        body: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
