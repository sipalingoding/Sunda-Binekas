import forms from "@tailwindcss/forms";
import autoprefixer from "autoprefixer";

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        destructive: "#dc2626",
        "destructive-foreground": "#fff",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [forms, autoprefixer],
  safelist: ["animate-spin"],
};
