/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '150px',     // Extra small devices (phones)
      'iphone-se': '375px', // iPhone SE
      'iphone-xr': '414px', // iPhone XR
      'iphone-12-pro': '390px', // iPhone 12 Pro
      'iphone-14-pro-max': '428px', // iPhone 14 Pro Max
      'pixel-7': '412px', // Pixel 7
      'galaxy-s8': '360px', // Samsung Galaxy S8+
      'galaxy-s20': '384px', // Samsung Galaxy S20 Ultra
      'galaxy-a51': '412px', // Samsung Galaxy A51/71
      'galaxy-fold': '280px', // Galaxy Z Fold 5 (folded)
      'galaxy-fold-open': '720px', // Galaxy Z Fold 5 (unfolded)
      'asus-fold': '300px', // Asus Zenbook Fold (folded)
      'asus-fold-open': '800px', // Asus Zenbook Fold (unfolded)
      'ipad-mini': '768px', // iPad Mini
      'ipad-air': '820px', // iPad Air
      'ipad-pro': '1024px', // iPad Pro
      'surface-pro': '912px', // Surface Pro 7
      'surface-duo': '540px', // Surface Duo
      'nest-hub': '1024px', // Nest Hub
      'nest-hub-max': '1280px', // Nest Hub Max
      'sm': '640px',    // Small devices (tablets)
      'md': '768px',    // Medium devices (landscape tablets)
      'lg': '1024px',   // Large devices (laptops/desktops)
      'xl': '1280px',   // Extra large devices (large desktops)
      '2xl': '1536px',  // 2X large devices
      '3xl': '1920px',  // 3X large devices (4K starts around here)
      '4xl': '2560px',  // 4X large devices
      '5xl': '3840px',  // 5X large devices (4K and beyond)
      '6xl': '4000px',  // 6X large devices (maximum requested size)
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
