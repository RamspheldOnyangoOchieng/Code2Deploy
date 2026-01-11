/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Core responsive breakpoints - ordered from smallest to largest
      'xs': '320px',      // Extra small phones (Galaxy Fold opened, small phones)
      'sm': '480px',      // Small phones (iPhone SE, regular phones)
      'md': '640px',      // Tablets portrait, large phones landscape
      'lg': '768px',      // Tablets landscape, small laptops
      'xl': '1024px',     // Laptops, desktops
      '2xl': '1280px',    // Large desktops
      '3xl': '1536px',    // Extra large desktops
      '4xl': '1920px',    // Full HD monitors
      '5xl': '2560px',    // 2K/QHD monitors
      '6xl': '3840px',    // 4K monitors

      // Device-specific breakpoints (optional, for edge cases)
      'galaxy-fold': '280px',     // Galaxy Z Fold (folded)
      'iphone-se': '375px',       // iPhone SE
      'iphone-xr': '414px',       // iPhone XR, 11
      'ipad-mini': '768px',       // iPad Mini
      'ipad-air': '820px',        // iPad Air
      'ipad-pro': '1024px',       // iPad Pro
      'surface-duo': '540px',     // Surface Duo
      'surface-pro': '912px',     // Surface Pro 7
    },
    extend: {
      colors: {
        primary: "#03325a",
        secondary: "#30d9fe",
        accent: "#eec262",
      },
      borderRadius: {
        'button': '0.5rem',
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
}
