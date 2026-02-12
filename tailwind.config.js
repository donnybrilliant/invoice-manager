/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // Keep as "media" - DO NOT change to "class" to preserve invoice PDF/printing isolation
  theme: {
    extend: {
      // Brutalist theme colors
      colors: {
        brutalist: {
          red: "hsl(358, 100%, 67%)",
          yellow: "hsl(44, 100%, 68%)",
          green: "hsl(137, 79%, 54%)",
          cyan: "hsl(201, 100%, 70%)",
        },
      },
      // Brutalist border widths
      borderWidth: {
        brutalist: "3px",
      },
      // Brutalist box shadows
      boxShadow: {
        brutalist: "6px 6px 0px hsl(0, 0%, 4%)",
        "brutalist-sm": "4px 4px 0px hsl(0, 0%, 4%)",
        "brutalist-lg": "8px 8px 0px hsl(0, 0%, 4%)",
        "brutalist-accent": "6px 6px 0px hsl(44, 100%, 68%)",
        "brutalist-red": "6px 6px 0px hsl(358, 100%, 67%)",
      },
      // Brutalist font family
      fontFamily: {
        "brutalist-mono": ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
