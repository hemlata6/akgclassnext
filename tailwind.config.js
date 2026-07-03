module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./page-components/**/*.{js,jsx}",
    "./constants/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brandPrimary: "#0749A2",
        brandDark: "#0B3276",
        brandGreen: "#164e33",
        brandGreenHover: "#0f3824",
        brandGreenDark: "#0a2818",
      },
      fontFamily: {
        sans: ['var(--font-family-base)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
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

