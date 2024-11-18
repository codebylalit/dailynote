// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customCursor: "rgba(255, 255, 255, 0.8)",
        customHover: "rgba(255, 255, 0, 0.8)",
      },
      spacing: {
        customSize: "30px",
      },
    },
  },
  plugins: [],
};
