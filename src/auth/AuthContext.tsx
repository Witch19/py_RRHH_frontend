import type { ReactNode } from "react";

import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState,useEffect} from "react";


/* ---------- Tipo de usuario ---------- */
// src/auth/AuthContext.tsx
export interface User {
  id: string;              
  username: string;
  email: string;
  role: string;
  trabajadorId?: number;     
}



/* ---------- Tipo del contexto ---------- */
interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/* ---------- Contexto ---------- */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------- Provider ---------- */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /* Cargar usuario guardado (si existe) */
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  /* Mantener sincronizado user ↔ localStorage cada vez que cambie */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /* ---------- Métodos ---------- */
 const login = (userData: any, token: string) => {
  const safeUser: User = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    trabajadorId: userData.trabajadorId,
  };

  setUser(safeUser);
  localStorage.setItem("token", token);
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");                                     
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ---------- Hook para consumir el contexto ---------- */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
