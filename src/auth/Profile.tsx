import React from "react";
import { useAuth } from "./AuthContext";

const Profile: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button onClick={() => login({ username: "Josy", email: "josy@example.com" }, "token_fake")}>
        Login
      </button>
    );
  }

  return (
    <div>
      <h1>Hola, {user.username}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
