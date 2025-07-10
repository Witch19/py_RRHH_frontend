import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Mi App RRHH</h1>
      </header>
      <main className="flex-grow p-6 bg-gray-50">{children}</main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
        &copy; 2025 Mi Empresa
      </footer>
    </div>
  );
};

export default Layout;  // <-- Exportación por defecto
