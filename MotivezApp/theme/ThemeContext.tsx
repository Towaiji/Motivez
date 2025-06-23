import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const scheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(scheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
