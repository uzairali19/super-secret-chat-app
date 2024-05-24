/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [(require('daisyui'))],
  daisyui: {
    themes: [
      {
        "basic": {
          "primary": "#ff9f00",
          "secondary": "#93f298",
          "accent": "#0084fe",
          "neutral": "#888888",
          "base-100": "#F2F2F7",
          "info": "#2C6BF2",
          "success": "#00e37a",
          "warning": "#EFCE61",
          "error": "#DF3434",
        },
      },
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
}
