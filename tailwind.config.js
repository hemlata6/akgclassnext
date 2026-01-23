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
        brandGreen: "#164e33",
        brandGreenHover: "#0f3824",
        brandGreenDark: "#0a2818",
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

