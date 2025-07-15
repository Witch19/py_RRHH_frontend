import { createContext, useContext, useState } from "react";

const colorThemes = {
  default: "linear(to-b, #2c3e50, #4ca1af)", 
  gray: "linear(to-b, gray.700, gray.500)",
  orange: "linear(to-b, orange.400, yellow.300)",
  teal: "linear(to-b, teal.500, blue.300)",
};

type ThemeColor = keyof typeof colorThemes;

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (color: ThemeColor) => void;
  gradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeColor>("default");

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, gradient: colorThemes[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColor = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeColor debe estar dentro de ThemeProvider");
  return context;
};
