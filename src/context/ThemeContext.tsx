import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

const lightTheme = {
  mode: 'light',
  background: '#f8f9fa',
  text: '#222',
  header: '#eaf4ff',
  card: '#fff',
  accent: '#27537B',
  tabActive: '#2a5fa0',
  tabInactive: '#E6F4FF',
  inputBg: '#fff',
  inputBorder: '#e0e0e0',
  textSecondary: '#888',
  serviceBox: '#E7E7E7',
  primary: '#27537B',
};

const darkTheme = {
  mode: 'dark',
  background: '#181A20',
  text: '#f5f6fa',
  header: '#23262F',
  card: '#23262F',
  accent: '#4E84C1',
  tabActive: '#4E84C1',
  tabInactive: '#23262F',
  inputBg: '#23262F',
  inputBorder: '#333',
  textSecondary: '#888',
  serviceBox: '#23262F',
  primary: '#4E84C1',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'dark') setTheme(darkTheme);
      else if (stored === 'light') setTheme(lightTheme);
      else {
        // Use system preference
        const colorScheme = Appearance.getColorScheme();
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    setTheme((prev) => {
      const next = prev.mode === 'light' ? darkTheme : lightTheme;
      AsyncStorage.setItem(THEME_KEY, next.mode);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 