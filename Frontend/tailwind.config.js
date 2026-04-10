/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  corePlugins: {
    preflight: false, // Prevent Tailwind from breaking existing styles
  },
  theme: {
    extend: {
      "colors": {
        "on-tertiary-fixed-variant": "#52452d",
        "surface": "#131313",
        "inverse-surface": "#e5e2e1",
        "on-secondary-fixed-variant": "#4c463b",
        "on-tertiary": "#3a2f19",
        "inverse-on-surface": "#313030",
        "on-primary-container": "#4e3700",
        "on-secondary-container": "#c0b7a9",
        "primary-fixed-dim": "#e9c176",
        "on-primary-fixed": "#261900",
        "primary-fixed": "#ffdea5",
        "surface-container-high": "#2a2a2a",
        "secondary-fixed-dim": "#cec5b6",
        "outline-variant": "#4e4639",
        "surface-container": "#201f1f",
        "on-surface-variant": "#d1c5b4",
        "background": "#131313",
        "tertiary": "#d7c4a5",
        "secondary": "#cec5b6",
        "on-background": "#e5e2e1",
        "surface-bright": "#393939",
        "error": "#ffb4ab",
        "on-tertiary-fixed": "#241a06",
        "surface-container-low": "#1c1b1b",
        "outline": "#9a8f80",
        "surface-container-highest": "#353534",
        "on-secondary": "#353025",
        "primary-container": "#c5a059",
        "primary": "#e9c176",
        "surface-tint": "#e9c176",
        "surface-variant": "#353534",
        "secondary-container": "#4e483d",
        "tertiary-container": "#b5a385",
        "tertiary-fixed-dim": "#d7c4a5",
        "surface-dim": "#131313",
        "surface-container-lowest": "#0e0e0e",
        "on-primary": "#412d00",
        "secondary-fixed": "#ebe1d2",
        "on-secondary-fixed": "#1f1b12",
        "on-tertiary-container": "#463922",
        "error-container": "#93000a",
        "tertiary-fixed": "#f4e0bf",
        "on-primary-fixed-variant": "#5d4201",
        "on-surface": "#e5e2e1",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "inverse-primary": "#775a19"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "fontFamily": {
        "headline": ["Noto Serif", "serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
