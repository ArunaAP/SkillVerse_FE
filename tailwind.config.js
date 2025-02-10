/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        blue: "#0057FF",

        // Primary Colors
        primary: {
          light: "#3B82F6", // Blue (lighter shade)
          DEFAULT: "#2563EB", // Blue
          dark: "#1E40AF", // Dark Blue
        },
        // Secondary Colors
        secondary: {
          light: "#FACC15", // Yellow (lighter shade)
          DEFAULT: "#EAB308", // Yellow
          dark: "#CA8A04", // Dark Yellow
        },
        // Neutral Colors
        neutral: {
          light: "#F3F4F6", // Light Gray
          DEFAULT: "#9CA3AF", // Gray
          dark: "#4B5563", // Dark Gray
        },
        // Custom Colors
        success: "#10B981", // Green
        error: "#EF4444", // Red
        warning: "#F97316", // Orange
        info: "#3B82F6", // Blue
      },
    },
  },
  plugins: [],
};
