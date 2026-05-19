import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_OPTIONS, DEFAULT_THEME_KEY } from './themeOptions';

const ThemeContext = createContext();

export const THEMES = THEME_OPTIONS;

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME_KEY);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Set default theme from centralized options file
      setCurrentTheme(DEFAULT_THEME_KEY);
    }
  }, []);

  // Inject CSS variables whenever theme changes
  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-primary-hover', theme.primaryHover);
      root.style.setProperty('--theme-primary-rgb', theme.primaryRgb || '33, 150, 243');
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
