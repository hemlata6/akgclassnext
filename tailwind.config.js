module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./page-components/**/*.{js,jsx}",
    "./constants/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGold: "#D4AF37",
        brandGoldDark: "#B8960F",
        brandGoldLight: "#E8C547",
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

