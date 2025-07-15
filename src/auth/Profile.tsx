import React from "react";
import { useAuth } from "./AuthContext";

const Profile: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button
        onClick={() =>
          login(
            {
              id: "12345", 
              username: "Josy",
              email: "josy@example.com",
              role: "ADMIN",
              trabajadorId: 99, 
            },
            "token_fake"
          )

        }
      >
        Login de prueba
      </button>
    );
  }

  return (
    <div>
      <h1>Hola, {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
