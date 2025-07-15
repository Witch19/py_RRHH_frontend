import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
      </header>
      <main className="flex-grow p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout; 
