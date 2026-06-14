import React, { createContext, useContext } from 'react';
import { theme, Theme } from '@shared/ui/theme';

const ThemeContext = createContext<Theme>(theme);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = (): Theme => useContext(ThemeContext);
