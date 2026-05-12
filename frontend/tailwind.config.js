export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe",
          500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 900: "#1e3a8a"
        },
        library: {
          50: "#faf5ff", 600: "#9333ea", 700: "#7e22ce"
        }
      }
    }
  },
  plugins: [],
};
