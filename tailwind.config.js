/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%, 100%": {
            transform: "translateX(-50%) translateY(-20px) scale(1)",
          },
          "50%": {
            transform: "translateX(-50%) translateY(20px) scale(1.05)",
          },
        },
      },
      animation: {
        wave: "wave 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
