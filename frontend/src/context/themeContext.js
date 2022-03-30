import { useLocalStorage } from 'hooks';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import React from 'react';
import { darkTheme, lightTheme } from 'styles/constants';

export const ThemeContext = React.createContext({
  isDarkTheme: true,
  toggleTheme: () => {},
});

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage('isDark', false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme: darkMode,
        toggleTheme,
      }}
    >
      <StyledThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
