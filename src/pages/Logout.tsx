// auth/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username?: string;
  email?: string;
  // ...otros campos
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", "token_value"); // o guarda tu token real
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");  // Redirigir al login o página pública
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro de un AuthProvider");
  return context;
};
