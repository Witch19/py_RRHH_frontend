// src/components/Layout.tsx
import React from "react";
import { ThemeProvider } from "../context/ThemeContext"; // Asegúrate que la ruta sea correcta

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4"></header>
        <main className="flex-grow p-6 bg-gray-50">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
