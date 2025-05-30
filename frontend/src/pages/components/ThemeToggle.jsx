import React from "react";

export default function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
    </button>
  );
}
