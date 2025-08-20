export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),   // ✅ enable daisyUI
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "neon"],  // ✅ add multiple themes
  },
}
