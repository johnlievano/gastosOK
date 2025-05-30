import React, { createContext, useState, useEffect, useContext } from "react";

// Creamos el contexto
export const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkmode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("isDarkmode", JSON.stringify(isDarkMode));

    // Aplicar clase directamente al <body> para que el modo oscuro funcione globalmente
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);
