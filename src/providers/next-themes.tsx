
import React from 'react';

// A simple implementation with similar API to next-themes
// but using our own ThemeContext from context/theme-context.tsx
export const useTheme = () => {
  // This is just a re-export of our own hook
  const { theme, toggleTheme } = require('../context/theme-context').useTheme();
  
  return {
    theme,
    setTheme: (newTheme: string) => {
      if (newTheme === 'dark' || newTheme === 'light') {
        if ((newTheme === 'dark' && theme === 'light') || 
            (newTheme === 'light' && theme === 'dark')) {
          toggleTheme();
        }
      }
    },
    resolvedTheme: theme,
  };
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Re-use our own ThemeProvider
  const { ThemeProvider: ActualThemeProvider } = require('../context/theme-context');
  return <ActualThemeProvider>{children}</ActualThemeProvider>;
};
