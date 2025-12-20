/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,html}',
    './index.html',
  ],
  theme: {
    extend: {}, // для своих стилей
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};
