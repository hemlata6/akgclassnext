import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Theme configurations
export const THEMES = {
  darkBlue: {
    name: 'Dark Blue',
    primary: '#0749A2',
    primaryHover: '#0B3276',
    primaryClass: 'bg-[#0749A2]',
    primaryHoverClass: 'hover:bg-[#0B3276]',
    textClass: 'text-[#0749A2]',
    borderClass: 'border-[#0749A2]',
    bgGradient: 'from-[#0749A2] to-[#0B3276]',
  },
  darkGreen: {
    name: 'Dark Green',
    primary: '#0d5a3e',
    primaryHover: '#0f7550',
    primaryClass: 'bg-emerald-900',
    primaryHoverClass: 'hover:bg-emerald-800',
    textClass: 'text-emerald-900',
    borderClass: 'border-emerald-900',
    bgGradient: 'from-emerald-900 to-emerald-800',
  },
  purple: {
    name: 'Purple',
    primary: 'rgb(55, 48, 163)', // indigo-700
    primaryHover: 'rgb(67, 56, 202)', // indigo-600
    primaryClass: 'bg-indigo-700',
    primaryHoverClass: 'hover:bg-indigo-600',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-700',
    bgGradient: 'from-indigo-700 to-indigo-800',
  },
  blue: {
    name: 'Blue',
    primary: '#2196F3',
    primaryHover: '#1976D2',
    primaryClass: 'bg-blue-500',
    primaryHoverClass: 'hover:bg-blue-600',
    textClass: 'text-blue-500',
    borderClass: 'border-blue-500',
    bgGradient: 'from-blue-500 to-blue-600',
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('darkBlue');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Set dark blue as default
      setCurrentTheme('darkBlue');
    }
  }, []);

  // Inject CSS variables whenever theme changes
  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-primary-hover', theme.primaryHover);
      root.style.setProperty('--theme-primary-class', theme.primaryClass);
      root.style.setProperty('--theme-primary-hover-class', theme.primaryHoverClass);
      root.style.setProperty('--theme-text-class', theme.textClass);
      root.style.setProperty('--theme-border-class', theme.borderClass);
    }
  }, [currentTheme]);

  // Save theme to localStorage when it changes
  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('siteTheme', themeName);
    }
  };

  const theme = THEMES[currentTheme];

  const value = {
    currentTheme,
    changeTheme,
    theme,
    themes: THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
