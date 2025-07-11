import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
